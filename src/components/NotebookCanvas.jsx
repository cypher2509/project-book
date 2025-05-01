import { CanvasTexture } from 'three';

export function createNotebookTexture({
  header = 'My Notebook Title',
  text = 'This is a very long line that should wrap nicely to the next line and stay inside the ruled lines below.'
} = {}) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const topMarginHeight = 80;
  const leftMarginX = 120;
  const textStartY = topMarginHeight + 10;

  // Background
  ctx.fillStyle = '#fafaf0';
  ctx.fillRect(0, 0, size, size);

  // === 🖍 Header text inside top bar ===
  ctx.fillStyle = '#00124d'; // red marker style
  ctx.font = "bold 56px 'Patrick Hand', cursive";
  ctx.textBaseline = 'middle';
  ctx.fillText(header, leftMarginX + 20, topMarginHeight / 2); // align vertically centered

  // === 📏 Horizontal ruled lines ===
  ctx.strokeStyle = '#00124d';
  ctx.lineWidth = 2;
  const lineHeight = 60;
  for (let y = textStartY ; y < size; y += lineHeight) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

    // === ✏️ Top Margin Horizontal Line ===
    ctx.strokeStyle = '#cce5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, topMarginHeight); // bottom of header box
    ctx.lineTo(size, topMarginHeight);
    ctx.stroke();
  

  // === 📕 Left red margin line ===
  ctx.strokeStyle = '#ff9999';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(leftMarginX, 0);
  ctx.lineTo(leftMarginX, size);
  ctx.stroke();

  // === ✍️ Body Text ===
  ctx.fillStyle = '#222';
  ctx.font = "48px 'Patrick Hand', cursive";
  ctx.textBaseline = 'bottom';

  const marginLeft = leftMarginX + 20;
  const maxWidth = size - marginLeft - 40;
  const words = text.split(/\s+/);

  let x = marginLeft;
  let y = textStartY + 60;
  let line = '';

  words.forEach((word) => {
    const testLine = line + word + ' ';
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth) {
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
      if (y + lineHeight > size) return;
    } else {
      line = testLine;
    }
  });

  if (y + lineHeight <= size && line.trim() !== '') {
    ctx.fillText(line.trim(), x, y);
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
