import { coverCrop } from "../../lib/motion";

// Original luminance glyph interpretation, not template code or fabricated source.
export function renderGlyphs(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  const columns = Math.min(84, Math.max(32, Math.round(width / 8)));
  const rows = Math.min(
    112,
    Math.max(28, Math.round(height / ((width / columns) * 1.6))),
  );
  const sample = document.createElement("canvas");
  sample.width = columns;
  sample.height = rows;
  const context = sample.getContext("2d", { willReadFrequently: true });
  const output = canvas.getContext("2d");
  if (!context || !output || !image.naturalWidth)
    throw new Error("Glyph canvas unavailable");
  const crop = coverCrop(
    image.naturalWidth,
    image.naturalHeight,
    columns,
    rows * 1.6,
  );
  context.drawImage(image, crop.x, crop.y / 1.6, crop.width, crop.height / 1.6);
  const pixels = context.getImageData(0, 0, columns, rows).data;
  const ratio = Math.min(
    1.5,
    window.devicePixelRatio || 1,
    960 / width,
    1200 / height,
  );
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  output.scale(ratio, ratio);
  output.fillStyle = "#0b0c0e";
  output.fillRect(0, 0, width, height);
  const cellWidth = width / columns,
    cellHeight = height / rows;
  output.font = `${cellHeight * 0.88}px monospace`;
  output.textBaseline = "middle";
  output.textAlign = "center";
  const glyphs = " .,:;+=*#%@";
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < columns; x++) {
      const index = (y * columns + x) * 4;
      const light =
        (pixels[index] * 0.2126 +
          pixels[index + 1] * 0.7152 +
          pixels[index + 2] * 0.0722) /
        255;
      if (light < 0.035) continue;
      const lime = (x + y) % 9 === 0;
      output.fillStyle = lime
        ? `rgba(198,255,61,${0.3 + light * 0.7})`
        : `rgba(241,242,236,${0.25 + light * 0.75})`;
      output.fillText(
        glyphs[Math.min(glyphs.length - 1, Math.floor(light * glyphs.length))],
        (x + 0.5) * cellWidth,
        (y + 0.5) * cellHeight,
      );
    }
}
