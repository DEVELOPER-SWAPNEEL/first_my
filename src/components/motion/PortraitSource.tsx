"use client";
import { useEffect, useRef } from "react";

export function PortraitSource({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.IntersectionObserver || !window.ResizeObserver) return;
    const box = root.current;
    const canvas = box?.querySelector("canvas");
    const image = box?.querySelector("img");
    const button = box?.querySelector("button");
    const label = box?.querySelector("[data-source-label]");
    const status = box?.querySelector("[role=status]");
    if (!box || !canvas || !image || !button || !label || !status) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let pinned = false,
      hover = false,
      visible = true,
      disposed = false,
      ready = false;
    let frame = 0,
      generation = 0,
      loading: Promise<void> | null = null;
    let rect = box.getBoundingClientRect(),
      origin = rect.top + scrollY,
      x = rect.width / 2,
      y = rect.height / 2;
    const paint = () => {
      frame = 0;
      const full = pinned && ready;
      const partial = hover && ready && fine.matches && !reduce.matches;
      const show = visible && !document.hidden && (full || partial);
      canvas.style.clipPath = full ? "none" : `circle(112px at ${x}px ${y}px)`;
      canvas.style.opacity = show ? "1" : "0";
      box.dataset.sourceState = full
        ? "source"
        : partial
          ? "pointer"
          : "render";
    };
    const schedule = () => {
      if (!frame && !disposed && visible && !document.hidden)
        frame = requestAnimationFrame(paint);
    };
    const prepare = () => {
      if (ready) {
        schedule();
        return;
      }
      if (loading) return;
      const token = generation;
      status.textContent = "Preparing portrait glyphs…";
      loading = (async () => {
        try {
          const renderer = await import("./glyph-renderer");
          await image.decode();
          if (disposed || token !== generation || !visible || document.hidden)
            return;
          const bounds = box.getBoundingClientRect();
          renderer.renderGlyphs(image, canvas, bounds.width, bounds.height);
          ready = true;
          rect = bounds;
          status.textContent =
            "Glyph interpretation of the approved portrait. No program source is displayed.";
          schedule();
        } catch {
          if (!disposed && token === generation) {
            ready = false;
            pinned = false;
            hover = false;
            button.setAttribute("aria-pressed", "false");
            label.textContent = "View source";
            status.textContent =
              "Source view unavailable. Portrait shown; activate View source to retry.";
            canvas.style.opacity = "0";
            box.dataset.sourceState = "fallback";
          }
        } finally {
          loading = null;
          if (
            !disposed &&
            token !== generation &&
            (pinned || hover) &&
            visible &&
            !document.hidden
          )
            prepare();
        }
      })();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !fine.matches || reduce.matches)
        return;
      if ((event.target as Element).closest("button")) {
        hover = false;
        schedule();
        return;
      }
      hover = true;
      x = event.clientX - rect.left;
      y = event.clientY + scrollY - origin;
      prepare();
      schedule();
    };
    const leave = () => {
      hover = false;
      schedule();
    };
    const toggle = () => {
      pinned = !pinned;
      hover = false;
      button.setAttribute("aria-pressed", String(pinned));
      label.textContent = pinned ? "View render" : "View source";
      if (pinned) prepare();
      if (reduce.matches) paint();
      else schedule();
    };
    const measure = () => {
      rect = box.getBoundingClientRect();
      origin = rect.top + scrollY;
      ready = false;
      generation++;
      if (pinned || hover) prepare();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(box);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) {
        rect = box.getBoundingClientRect();
        origin = rect.top + scrollY;
        if (pinned) prepare();
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        hover = false;
        canvas.style.opacity = "0";
      }
    });
    observer.observe(box);
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        hover = false;
        canvas.style.opacity = "0";
      } else {
        rect = box.getBoundingClientRect();
        origin = rect.top + scrollY;
        schedule();
      }
    };
    const preference = () => {
      hover = false;
      cancelAnimationFrame(frame);
      frame = 0;
      paint();
    };
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerleave", leave);
    button.addEventListener("click", toggle);
    document.addEventListener("visibilitychange", visibility);
    reduce.addEventListener("change", preference);
    fine.addEventListener("change", preference);
    box.dataset.sourceReady = "true";
    button.disabled = false;
    status.textContent = "Portrait shown. Activate View source for a glyph interpretation.";
    return () => {
      disposed = true;
      generation++;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerleave", leave);
      button.removeEventListener("click", toggle);
      document.removeEventListener("visibilitychange", visibility);
      reduce.removeEventListener("change", preference);
      fine.removeEventListener("change", preference);
      canvas.style.opacity = "0";
      button.disabled = true;
      delete box.dataset.sourceReady;
    };
  }, []);
  return (
    <div
      ref={root}
      className={`${className} portrait-source`}
      data-cursor-surface="VIEW"
    >
      {children}
      <canvas id="portrait-glyph" aria-hidden="true" />
      <div className="portrait-source-control">
        <button
          type="button"
          disabled
          aria-pressed="false"
          aria-controls="portrait-glyph"
          aria-describedby="portrait-source-help"
        >
          <span aria-hidden="true">{"{ }"}</span>
          <span data-source-label>View source</span>
        </button>
        <p id="portrait-source-help">Portrait ↔ glyph interpretation</p>
        <p role="status" className="sr-only">
          Interactive source view requires JavaScript; the portrait remains
          available.
        </p>
      </div>
    </div>
  );
}
