export const compileDuration = 760;
const symbols = "<>/{}[]_#01=+;";

export function compileFrame(text: string, progress: number, tick: number) {
  const resolved = Math.floor(text.length * Math.max(0, Math.min(1, progress)));
  return Array.from(text, (letter, i) =>
    i < resolved || /\s/.test(letter)
      ? letter
      : symbols[(i * 7 + tick * 3) % symbols.length],
  ).join("");
}

export function coverCrop(iw: number, ih: number, w: number, h: number) {
  const scale = Math.max(w / iw, h / ih);
  return {
    width: iw * scale,
    height: ih * scale,
    x: (w - iw * scale) * 0.72,
    y: (h - ih * scale) * 0.42,
  };
}

// One outstanding callback; cancellation also settles decorative text.
export function finiteFrames(
  duration: number,
  update: (progress: number, timestamp: number) => void,
  settle: () => void,
  request = requestAnimationFrame,
  cancel = cancelAnimationFrame,
) {
  let handle = 0,
    start: number | undefined,
    stopped = false;
  const finish = () => {
    if (stopped) return;
    stopped = true;
    cancel(handle);
    settle();
  };
  const frame = (timestamp: number) => {
    if (stopped) return;
    start ??= timestamp;
    const progress = Math.min(1, (timestamp - start) / duration);
    try {
      update(progress, timestamp);
    } catch {
      finish();
      return;
    }
    if (progress === 1) finish();
    else handle = request(frame);
  };
  handle = request(frame);
  return finish;
}
