"use client";
import { useEffect } from "react";
import { compileDuration, compileFrame, finiteFrames } from "@/lib/motion";

export function HomeMotion() {
  useEffect(() => {
    if (
      !window.IntersectionObserver ||
      !window.ResizeObserver ||
      !Element.prototype.animate
    )
      return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const active = new Map<Element, () => void>();
    const seen = new WeakSet<Element>();
    const finishAll = () => {
      active.forEach((stop) => stop());
      active.clear();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          // Hero frames start in CSS on first paint, before hydration.
          if (node.closest("#hero")) {
            observer.unobserve(node);
            continue;
          }
          if (!entry.isIntersecting) {
            active.get(node)?.();
            active.delete(node);
            continue;
          }
          if (seen.has(node)) continue;
          seen.add(node);
          if (reduce.matches || document.hidden) continue;
          if (node.hasAttribute("data-compile")) {
            const words = Array.from(
              node.querySelectorAll<HTMLElement>(".compile-symbols"),
            );
            let lastTick = -1;
            node.dataset.compiling = "true";
            const stop = finiteFrames(
              compileDuration,
              (progress) => {
                const tick = Math.floor(progress * 22);
                if (tick === lastTick) return;
                lastTick = tick;
                words.forEach((word, i) => {
                  word.textContent = compileFrame(
                    word.dataset.word!,
                    Math.max(0, progress * 1.25 - i * 0.04),
                    tick,
                  );
                });
              },
              () => {
                delete node.dataset.compiling;
                words.forEach((word) => (word.textContent = ""));
                active.delete(node);
              },
            );
            active.set(node, stop);
            continue;
          }
          const kind = node.dataset.reveal;
          const targets =
            kind === "words"
              ? Array.from(node.querySelectorAll<HTMLElement>("[data-rise]"))
              : [node];
          const animations: Animation[] = [];
          try {
            targets.forEach((target, i) => {
              const frames =
                kind === "words"
                  ? [
                      { transform: "translateY(110%)" },
                      { transform: "translateY(0)" },
                    ]
                  : kind === "image"
                    ? [
                        {
                          clipPath: "inset(0 0 100% 0)",
                          transform: "scale(1.04)",
                        },
                        { clipPath: "inset(0)", transform: "scale(1)" },
                      ]
                    : kind === "rule"
                      ? [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
                      : [
                          { opacity: 0, transform: "translateY(14px)" },
                          { opacity: 1, transform: "translateY(0)" },
                        ];
              const animation = target.animate(frames, {
                duration: kind === "image" || kind === "rule" ? 900 : 800,
                easing:
                  kind === "image"
                    ? "cubic-bezier(.7,0,.2,1)"
                    : "cubic-bezier(.16,.84,.24,1)",
                delay: kind === "words" ? Math.min(i * 35, 210) : 0,
                fill: "backwards",
              });
              animations.push(animation);
            });
            const stop = () => {
              animations.forEach((animation) => animation.cancel());
              active.delete(node);
            };
            active.set(node, stop);
            void Promise.all(animations.map((a) => a.finished)).then(
              stop,
              stop,
            );
          } catch {
            animations.forEach((a) => a.cancel());
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -28px 0px" },
    );
    document
      .querySelectorAll("#main [data-reveal], #main [data-compile]")
      .forEach((node) => observer.observe(node));

    const illuminated =
      document.querySelector<HTMLElement>("[data-illuminate]");
    const words = Array.from(illuminated?.children ?? []) as HTMLElement[];
    let top = 0,
      height = 1,
      visible = false,
      frame = 0,
      peak = 0;
    const measure = () => {
      if (illuminated) {
        top = illuminated.getBoundingClientRect().top + scrollY;
        height = illuminated.offsetHeight;
      }
      schedule();
    };
    const draw = () => {
      frame = 0;
      const progress = reduce.matches
        ? 1
        : Math.min(
            1,
            Math.max(
              0,
              (scrollY + innerHeight * 0.85 - top) /
                (height + innerHeight * 0.3),
            ),
          );
      peak = Math.max(peak, progress);
      words.forEach(
        (word, i) =>
          (word.style.opacity = String(
            0.6 + 0.4 * Math.max(0, Math.min(1, peak * (words.length + 4) - i)),
          )),
      );
    };
    function schedule() {
      if (!frame && visible && peak < 1 && !document.hidden)
        frame = requestAnimationFrame(draw);
    }
    const aboutObserver = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) measure();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resize = new ResizeObserver(measure);
    if (illuminated) {
      aboutObserver.observe(illuminated);
      resize.observe(illuminated);
    }
    const preference = () => {
      if (reduce.matches) {
        finishAll();
        words.forEach((w) => (w.style.opacity = "1"));
      } else schedule();
    };
    const visibility = () => {
      if (document.hidden) {
        finishAll();
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", visibility);
    reduce.addEventListener("change", preference);
    return () => {
      observer.disconnect();
      aboutObserver.disconnect();
      resize.disconnect();
      finishAll();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", visibility);
      reduce.removeEventListener("change", preference);
      words.forEach((w) => w.style.removeProperty("opacity"));
    };
  }, []);
  return null;
}
