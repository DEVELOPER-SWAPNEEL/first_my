"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DraftFixture } from "@/content/home-draft";
import { contactMailto } from "@/lib/contact";
import { boundIndex, briefSummary, toggleRow } from "@/lib/home-state";
import { Action, Placeholder } from "./Primitives";
import styles from "./Home.module.css";

export function StackBoard({
  tools,
  groups,
}: {
  tools: DraftFixture[];
  groups: string[];
}) {
  const [selected, setSelected] = useState(0);
  const tool = tools[selected];
  return (
    <div className={styles.stackLayout}>
      <div
        className={`${styles.plate} ${styles.board}`}
        role="group"
        aria-label="Draft stack keys"
      >
        {groups.map((group, g) => (
          <div className={styles.keyGroup} key={group}>
            <p className={styles.small}>
              {group}
              <span>04</span>
            </p>
            <div className={styles.keys}>
              {tools.slice(g * 4, g * 4 + 4).map((item, k) => {
                const index = g * 4 + k;
                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-pressed={selected === index}
                    aria-controls="selected-key"
                    onFocus={() => setSelected(index)}
                    onClick={() => setSelected(index)}
                  >
                    <span className={styles.small}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div
        id="selected-key"
        className={`${styles.plate} ${styles.keyPanel}`}
        role="region"
        aria-label="Selected draft key"
        aria-live="polite"
      >
        <p
          className={styles.small}
        >{`Key ${String(selected + 1).padStart(2, "0")} of 16 · ${groups[Math.floor(selected / 4)]}`}</p>
        <h3>{tool.title}</h3>
        <p className={styles.toolUsage}>{tool.usage}</p>
        <p className={styles.small}>Evidence context · no proficiency rating</p>
        <p className={styles.panelDescription}>{tool.description}</p>
      </div>
    </div>
  );
}

export function SingleAccordion({
  items,
  kind,
}: {
  items: DraftFixture[];
  kind: "services" | "faq";
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul
      className={kind === "services" ? styles.services : styles.faqRows}
      aria-label={
        kind === "services" ? "Draft engineering work areas" : "Draft questions"
      }
    >
      {items.map((item, i) => {
        const expanded = open === i,
          id = `${kind}-${i}`;
        return (
          <li key={id}>
            <h3>
              <button
                className={
                  kind === "services"
                    ? styles.serviceTrigger
                    : styles.faqTrigger
                }
                type="button"
                id={`${id}-trigger`}
                aria-expanded={expanded}
                aria-controls={`${id}-panel`}
                onClick={() => setOpen(toggleRow(open, i))}
              >
                <span className={styles.small}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item.title}</span>
                {kind === "services" && (
                  <>
                    <span className={styles.triggerDescription}>
                      {item.description}
                    </span>
                    <span className={styles.small}>Draft work area</span>
                  </>
                )}
                <span className={styles.plus} aria-hidden="true">
                  {expanded ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`${id}-panel`}
              role="region"
              aria-labelledby={`${id}-trigger`}
              hidden={!expanded}
              className={
                kind === "services" ? styles.servicePanel : styles.faqPanel
              }
            >
              {kind === "services" ? (
                <>
                  <div>
                    <p>{item.detail}</p>
                  </div>
                  <div>
                    <p className={styles.small}>Tools in supplied evidence</p>
                    <ul>
                      {item.tags?.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                  <dl className={styles.serviceSpec}>
                    <dt>Context</dt>
                    <dd>{item.usage}</dd>
                    <dt>Availability</dt>
                    <dd>Open to discussion · no commercial offering implied</dd>
                  </dl>
                </>
              ) : (
                <p>{item.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function LabRail({ items }: { items: DraftFixture[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const scrollTo = (next: number) => {
    const list = rail.current;
    if (!list) return;
    const bounded = boundIndex(next, items.length);
    const card = list.children[bounded] as HTMLElement;
    list.scrollTo({
      left: card.offsetLeft - list.offsetLeft,
      behavior: "instant",
    });
    sync();
  };
  const sync = useCallback(() => {
    const list = rail.current;
    if (!list) return;
    const first = list.children[0] as HTMLElement;
    const stride =
      first?.offsetWidth + parseFloat(getComputedStyle(list).gap || "0");
    setIndex(boundIndex(Math.round(list.scrollLeft / stride), items.length));
    setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 2);
  }, [items.length]);
  useEffect(() => {
    const list = rail.current;
    if (!list) return;
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    return () => observer.disconnect();
  }, [sync]);
  return (
    <>
      <div className={styles.railControls}>
        <button
          type="button"
          aria-label="Previous lab slot"
          disabled={index === 0}
          aria-controls="draft-lab-rail"
          onClick={() => scrollTo(index - 1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next lab slot"
          disabled={atEnd}
          aria-controls="draft-lab-rail"
          onClick={() => scrollTo(index + 1)}
        >
          →
        </button>
      </div>
      <ul
        ref={rail}
        id="draft-lab-rail"
        className={styles.labRail}
        aria-label="Draft lab slots"
        onScroll={sync}
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <a href={item.href}>
              <div className={styles.labImage}>
                <Placeholder
                  label={`Lab image ${String(i + 1).padStart(2, "0")}`}
                />
                <span className={styles.tag}>Local demo</span>
              </div>
              <div className={styles.labCopy}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className={styles.small}>
                  Demo preview · no release or statistics
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.railFooter}>
        <span className={styles.railProgress} aria-hidden="true">
          <i style={{ width: `${((index + 1) / items.length) * 100}%` }} />
        </span>
        <p className={styles.small} aria-live="polite">
          Lab position {index + 1} of {items.length}
          {atEnd ? " · end" : ""}
        </p>
        <Action href="/lab" quiet>
          All local lab previews
        </Action>
      </div>
    </>
  );
}

export function DraftBrief({
  kinds,
  topics,
}: {
  kinds: string[];
  topics: string[];
}) {
  const [kind, setKind] = useState<string | null>(null),
    [topic, setTopic] = useState<string | null>(null),
    [name, setName] = useState("");
  return (
    <div className={styles.briefLayout}>
      <div className={styles.briefSteps}>
        {[
          {
            label: "Opportunity",
            items: kinds,
            value: kind,
            set: setKind,
          },
          {
            label: "Topic",
            items: topics,
            value: topic,
            set: setTopic,
          },
        ].map((group, i) => (
          <fieldset key={group.label}>
            <legend>
              <span className={styles.small}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {group.label}
            </legend>
            <div className={styles.picks}>
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={group.value === item}
                  onClick={() => group.set(group.value === item ? null : item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
        <div className={styles.nameField}>
          <label htmlFor="draft-brief-name">
            <span className={styles.small}>03</span>Optional message
          </label>
          <textarea
            id="draft-brief-name"
            maxLength={1000}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            rows={4}
            placeholder="A little context for your email (stays local until you open your email app)"
          />
        </div>
      </div>
      <div className={`${styles.plate} ${styles.briefPanel}`}>
        <p className={styles.fileBar}>
          brief.ts <span>DRAFT · not sent</span>
        </p>
        <pre>
          <code>{`export const draftBrief = {\n  opportunity: ${JSON.stringify(kind)},\n  topic: ${JSON.stringify(topic)},\n  message: ${JSON.stringify(name.trim() || null)}\n}`}</code>
        </pre>
        <p className={styles.briefSummary} aria-live="polite">
          Draft summary: {briefSummary(kind, topic, name)}
        </p>
        <a
          className={`${styles.action} ${styles.primary}`}
          href={contactMailto(kind, topic, name)}
          aria-describedby="brief-handoff-note"
        >
          Open email composer <span aria-hidden="true">↗</span>
        </a>
        <p id="brief-handoff-note" className={styles.small}>
          Opening your email app does not send the message. Review and send it
          there. Nothing is stored by this page.
        </p>
      </div>
    </div>
  );
}
