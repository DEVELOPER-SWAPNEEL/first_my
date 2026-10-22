import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { currentFact, publishedValue } from "../src/lib/content.ts";
import { compileFrame, coverCrop, finiteFrames } from "../src/lib/motion.ts";
import { routes } from "../src/content/routes.ts";
import type { ContentField, ContentStatus } from "../src/types/content.ts";

test("finite motion owns one callback, settles exactly once and cancels pending work", () => {
  const queue = new Map<number, FrameRequestCallback>();
  let id = 0,
    settled = 0;
  const values: number[] = [];
  const request = (callback: FrameRequestCallback) => {
    queue.set(++id, callback);
    return id;
  };
  const cancel = (handle: number) => {
    queue.delete(handle);
  };
  const stop = finiteFrames(
    760,
    (progress) => values.push(progress),
    () => settled++,
    request,
    cancel,
  );
  const tick = (time: number) => {
    const [handle, callback] = [...queue][0];
    queue.delete(handle);
    callback(time);
    assert.ok(queue.size <= 1);
  };
  tick(100);
  tick(480);
  tick(860);
  assert.deepEqual(values, [0, 0.5, 1]);
  assert.equal(queue.size, 0);
  assert.equal(settled, 1);
  stop();
  assert.equal(settled, 1);
  const interrupt = finiteFrames(
    760,
    () => {},
    () => settled++,
    request,
    cancel,
  );
  tick(1000);
  interrupt();
  interrupt();
  assert.equal(queue.size, 0);
  assert.equal(settled, 2);
  const fail = finiteFrames(
    760,
    () => {
      throw Error("render failure");
    },
    () => settled++,
    request,
    cancel,
  );
  tick(1100);
  fail();
  assert.equal(queue.size, 0);
  assert.equal(settled, 3);
});

test("compile resolves real Unicode text and crop retains the approved focal region", () => {
  const text = "Networking & remote access · Swapneel";
  assert.equal(compileFrame(text, 1, 500), text);
  assert.equal(compileFrame(text, 10, 1), text);
  assert.equal(
    compileFrame(text, 0, 2).split(" ").length,
    text.split(" ").length,
  );
  for (const [w, h] of [
    [684, 900],
    [390, 380],
    [810, 500],
  ]) {
    const crop = coverCrop(1536, 1024, w, h);
    assert.ok(crop.width >= w && crop.height >= h);
    assert.ok(crop.x <= 0 && crop.y <= 0);
    assert.ok(crop.x + crop.width >= w && crop.y + crop.height >= h);
  }
});

test("private and draft values cannot enter presentation even if approved", () => {
  for (const status of ["DRAFT", "PRIVATE_DO_NOT_PUBLISH"] as ContentStatus[]) {
    const field: ContentField<string> = {
      value: "sensitive sentinel",
      status,
      approvedForPublication: true,
      lastVerified: null,
    };
    assert.equal(publishedValue(field), null);
    assert.equal(currentFact(field), null);
  }
});

test("aspirations and learning cannot become verified profile facts", () => {
  for (const status of ["ASPIRATION", "LEARNING_NOW"] as ContentStatus[]) {
    assert.equal(
      currentFact({
        value: "future claim",
        status,
        approvedForPublication: true,
        lastVerified: null,
      }),
      null,
    );
  }
  assert.equal(
    currentFact({
      value: "confirmed",
      status: "VERIFIED_CURRENT",
      approvedForPublication: false,
      lastVerified: "2026-10-13",
    }),
    null,
  );
  assert.equal(
    currentFact({
      value: "confirmed",
      status: "VERIFIED_CURRENT",
      approvedForPublication: true,
      lastVerified: "2026-10-13",
    }),
    "confirmed",
  );
});

test("route registry matches the audited scope without extra proposed routes", () => {
  const evidence = JSON.parse(
    readFileSync(
      new URL("../docs/reference/route-index.json", import.meta.url),
      "utf8",
    ),
  ) as { url: string }[];
  assert.deepEqual(
    routes.map((r) => r.path).sort(),
    evidence.map((r) => new URL(r.url).pathname).sort(),
  );
  assert.equal(new Set(routes.map((r) => r.path)).size, 41);
  for (const route of routes.filter((r) => r.parent)) {
    assert.equal(route.mappingIdentifier, true);
    assert.ok(routes.some((parent) => parent.path === route.parent));
    assert.match(route.label, /^Unfinished/);
  }
});

test("homepage structural fixtures stay draft and only link to registered destinations", async () => {
  const { homeDraft, sectionOrder } =
    await import("../src/content/home-draft.ts");
  const inspect = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    const object = value as Record<string, unknown>;
    if ("status" in object) {
      assert.equal(object.status, "DRAFT");
      assert.equal(object.approvedForPublication, false);
    }
    if (typeof object.href === "string")
      assert.ok(
        routes.some((r) => r.path === object.href) ||
          object.href ===
            "https://github.com/DEVELOPER-SWAPNEEL/AI-Sales-Support-Assistant-for-E-commerce-Brands",
      );
    Object.values(object).forEach(inspect);
  };
  inspect(homeDraft);
  assert.equal(sectionOrder.length, 13);
  assert.deepEqual(
    [
      homeDraft.work.length,
      homeDraft.tools.length,
      homeDraft.services.length,
      homeDraft.career.length,
      homeDraft.lab.length,
      homeDraft.reviews.length,
      homeDraft.writing.length,
      homeDraft.faq.length,
    ],
    [5, 16, 4, 3, 6, 5, 5, 8],
  );
});

test("contact handoff fixes recipient and encodes user text only in the body", async () => {
  const { contactMailto } = await import("../src/lib/contact.ts");
  const message =
    "Hello & bcc=unwanted@example.test\n?subject=changed <script>literal</script> 😀";
  const url = new URL(contactMailto("Collaboration", "LaunchOps", message));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "rsnikupurohit17@gmail.com");
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
  assert.equal(url.searchParams.get("subject"), "Website enquiry");
  assert.ok(url.searchParams.get("body")!.endsWith(message));
  assert.ok(
    new URL(contactMailto(null, null, "x".repeat(1200))).searchParams
      .get("body")!
      .endsWith("x".repeat(1000)),
  );
});

test("personalized work stays sanitized and cannot target fictional case pages", async () => {
  const { workEvidence } = await import("../src/content/work-evidence.ts");
  const serialized = JSON.stringify(workEvidence);
  assert.doesNotMatch(
    serialized,
    /\b(?:\d{1,3}\.){3}\d{1,3}\b|\/Users\/|\.docx|\.xlsx|aws_account_id|AKIA/,
  );
  assert.equal(
    new Set(workEvidence.map((c) => c.intendedSlug)).size,
    workEvidence.length,
  );
  assert.ok(
    workEvidence.every(
      (c) =>
        !c.href || c.href.startsWith("https://github.com/DEVELOPER-SWAPNEEL/"),
    ),
  );
  assert.ok(
    workEvidence.every((c) => c.credit && c.boundary && c.sourceIds.length),
  );
  assert.equal(workEvidence[0].prepared.includes("Dockerfile"), true);
});
