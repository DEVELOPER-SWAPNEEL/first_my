"use client";
import { useEffect, useRef } from "react";
export function FooterWordmark({ name }: { name: string }) {
  const container = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    let previousWidth = 0;
    const fit = () => {
      const box = container.current;
      const text = word.current;
      if (!box || !text) return;
      const width = box.clientWidth;
      if (width <= 0 || width === previousWidth) return;
      previousWidth = width;
      text.style.fontSize = "100px";
      let size = 100;
      for (let pass = 0; pass < 3; pass++) {
        const measured = text.getBoundingClientRect().width;
        if (measured <= 0) break;
        size = (size * width) / measured;
        text.style.fontSize = `${size}px`;
      }
    };
    const observer = new ResizeObserver(fit);
    if (container.current) observer.observe(container.current);
    void document.fonts.ready.then(() => {
      previousWidth = 0;
      fit();
    });
    return () => observer.disconnect();
  }, [name]);
  return (
    <div ref={container} className="footer-wordmark">
      <p ref={word} aria-label={`${name}`}>
        {name}
      </p>
    </div>
  );
}
