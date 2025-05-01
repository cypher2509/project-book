import { CanvasTexture , SRGBColorSpace} from "three";

export function createImageDataTexture(imageData = [],fillColor ="#2e2e2e") 
{
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, size, size);

  // Map imageData into full drawing info
  const images = imageData.map((img, i) => ({
    src: img.src,
    x: img.position[0] ?? 100,
    y: img.position[1] ?? 100 + i * 220,
    width: img.size[0] ?? 300,
    height: img.size[1] ?? 200,
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
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
