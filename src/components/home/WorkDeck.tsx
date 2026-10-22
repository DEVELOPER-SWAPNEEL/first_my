"use client";
import { useEffect, useRef } from "react";
import styles from "./Home.module.css";
export function WorkDeck({ children }: { children: React.ReactNode }) {
  const deck = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!window.IntersectionObserver || !window.ResizeObserver) return;
    const list = deck.current;
    if (!list) return;
    let frame = 0,
      visible = false,
      start = 0;
    const items = Array.from(list.children) as HTMLElement[];
    let strides: number[] = [];
    const size = window.matchMedia(
      "(min-width: 1200px) and (min-height: 760px)",
    );
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      frame = 0;
      const enabled = size.matches;
      const reduced = motion.matches;
      const y = window.scrollY;
      items.forEach((item, i) => {
        const stride = strides[i];
        const progress =
          enabled && !reduced
            ? Math.max(
                0,
                Math.min(
                  items.length - i - 1,
                  (y + 72 + i * 14 - start - i * stride) / stride,
                ),
              )
            : 0;
        item.style.setProperty("--deck-scale", String(1 - progress * 0.04));
      });
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(update);
    };
    const measure = () => {
      start = list.getBoundingClientRect().top + window.scrollY;
      strides = items.map((item) => item.clientHeight + 28);
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) {
          measure();
          schedule();
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(list);
    const preference = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (motion.matches || !size.matches)
        items.forEach((item) => item.style.setProperty("--deck-scale", "1"));
      else schedule();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    size.addEventListener("change", preference);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", preference);
      size.removeEventListener("change", preference);
    };
  }, []);
  return (
    <ul
      ref={deck}
      className={styles.workDeck}
      aria-label="Draft selected project slots"
    >
      {children}
    </ul>
  );
}
