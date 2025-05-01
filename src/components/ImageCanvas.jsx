import { CanvasTexture } from "three";

export function createImageDataTexture(imageData = []) {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);

  // Map imageData into full drawing info
  const images = imageData.map((img, i) => ({
    src: img.src,
    x: img.canvasX ?? 100,
    y: img.canvasY ?? 100 + i * 220,
    width: img.canvasWidth ?? 300,
    height: img.canvasHeight ?? 200,
  }));

  // Load and draw
  images.forEach((data) => {
    const img = new Image();
    img.src = data.src;
    img.onload = () => {
      ctx.drawImage(img, data.x, data.y, data.width, data.height);
      texture.needsUpdate = true;
    };
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
