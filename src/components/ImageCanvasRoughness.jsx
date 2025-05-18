import { CanvasTexture, SRGBColorSpace } from "three";

export function createImageTextureWithRoughness(imageData = []) {
    const size = 1024;
  
    // Main texture (RGB)
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
  
    // Roughness texture (grayscale)
    const roughCanvas = document.createElement("canvas");
    roughCanvas.width = size;
    roughCanvas.height = size;
    const roughCtx = roughCanvas.getContext("2d");
  
    // Paper: fill with white (rough = 1 = matte)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);
    roughCtx.fillStyle = "#fff";
    roughCtx.fillRect(0, 0, size, size);
  
    const images = imageData.map((img, i) => ({
      src: img.src,
      x: img.position[0] ?? 100,
      y: img.position[1] ?? 100 + i * 220,
      width: img.size[0] ?? 300,
      height: img.size[1] ?? 200,
    }));
    
    
    const texture = new CanvasTexture(canvas);
    const roughnessMap = new CanvasTexture(roughCanvas);
  
    images.forEach((data) => {
      const img = new Image();
      img.src = data.src;
      img.colorSpace = SRGBColorSpace;
      img.onload = () => {
        // Draw image
        ctx.drawImage(img, data.x, data.y, data.width, data.height);
  
        // On roughness map, draw black shape over image area (black = shiny)
        roughCtx.fillStyle = "#000"; // black = roughness 0 = glossy
        roughCtx.fillRect(data.x, data.y, data.width, data.height);
  
        texture.needsUpdate = true;
        roughnessMap.needsUpdate = true;
      };
    });
  
    return { texture, roughnessMap };
  }
  