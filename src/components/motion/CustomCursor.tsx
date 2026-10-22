"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const overlay = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!window.MutationObserver) return;
    const layer = overlay.current;
    const dot = layer?.querySelector<HTMLElement>("[data-cursor-dot]");
    const ring = layer?.querySelector<HTMLElement>("[data-cursor-ring]");
    const label = layer?.querySelector<HTMLElement>("[data-cursor-label]");
    if (!layer || !dot || !ring || !label) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      previous = 0,
      tracking = false;
    let target: Element | null = null,
      allowed = false;
    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      tracking = false;
      target = null;
      layer.hidden = true;
      delete document.documentElement.dataset.cursorActive;
      layer.dataset.tracking = "idle";
    };
    const follow = (time: number) => {
      frame = 0;
      try {
        const alpha = 1 - Math.exp(-Math.min(48, time - previous) / 65);
        previous = time;
        rx += (x - rx) * alpha;
        ry += (y - ry) * alpha;
        if (Math.abs(x - rx) + Math.abs(y - ry) < 0.15) {
          rx = x;
          ry = y;
        }
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        if (rx !== x || ry !== y) frame = requestAnimationFrame(follow);
        else layer.dataset.tracking = "idle";
      } catch {
        hide();
      }
    };
    const move = (event: PointerEvent) => {
      try {
        if (
          event.pointerType !== "mouse" ||
          !fine.matches ||
          reduce.matches ||
          document.hidden ||
          document.querySelector("dialog[open]") ||
          event.buttons ||
          !window.getSelection()?.isCollapsed
        ) {
          hide();
          return;
        }
        const element = event.target instanceof Element ? event.target : null;
        if (element !== target) {
          target = element;
          const action = element?.closest("a[href],button:not(:disabled)");
          const surface = element?.closest("[data-cursor-surface]");
          const cursor = element ? getComputedStyle(element).cursor : "auto";
          const native = element?.closest(
            "input,textarea,select,[contenteditable],iframe,video,audio,[data-native-cursor]",
          );
          const text =
            !action &&
            !surface &&
            element?.closest("p,h1,h2,h3,h4,pre,code,li,dt,dd,label");
          allowed =
            !!element &&
            !native &&
            !text &&
            !/text|resize|grab|not-allowed|wait|progress/.test(cursor);
          layer.dataset.interactive = action ? "true" : "false";
          label.textContent =
            action?.tagName === "A"
              ? "OPEN"
              : surface && !action
                ? surface.getAttribute("data-cursor-surface")
                : "";
        }
        if (!allowed) {
          hide();
          return;
        }
        x = event.clientX;
        y = event.clientY;
        dot.style.transform = `translate3d(${x}px,${y}px,0)`;
        if (!tracking) {
          rx = x;
          ry = y;
          previous = performance.now();
          ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        }
        layer.hidden = false;
        tracking = true;
        // Native cursor is hidden only after both visible elements have positions.
        if (document.documentElement.dataset.cursorActive !== "true")
          document.documentElement.dataset.cursorActive = "true";
        layer.dataset.tracking = "moving";
        if (!frame) frame = requestAnimationFrame(follow);
      } catch {
        hide();
      }
    };
    const exit = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const menu = new MutationObserver(() => {
      if (document.querySelector("dialog[open]")) hide();
    });
    document
      .querySelectorAll("dialog")
      .forEach((dialog) =>
        menu.observe(dialog, { attributes: true, attributeFilter: ["open"] }),
      );
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", exit);
    document.addEventListener("pointerdown", hide);
    document.addEventListener("pointercancel", hide);
    document.addEventListener("keydown", hide);
    document.addEventListener("selectionchange", hide);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);
    fine.addEventListener("change", hide);
    reduce.addEventListener("change", hide);
    return () => {
      hide();
      menu.disconnect();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", exit);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("pointercancel", hide);
      document.removeEventListener("keydown", hide);
      document.removeEventListener("selectionchange", hide);
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", hide);
      fine.removeEventListener("change", hide);
      reduce.removeEventListener("change", hide);
    };
  }, [pathname]);
  return (
    <div ref={overlay} className="custom-cursor" hidden aria-hidden="true">
      <i data-cursor-dot />
      <div data-cursor-ring>
        <i />
        <span data-cursor-label />
      </div>
    </div>
  );
}
