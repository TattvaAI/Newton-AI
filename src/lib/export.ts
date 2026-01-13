import Matter from 'matter-js';

export type ExportFormat = 'png' | 'jpg' | 'svg';

interface ExportOptions {
  format?: ExportFormat;
  quality?: number; // 0-1 for jpg
  scale?: number; // Resolution multiplier
  backgroundColor?: string;
}

/**
 * Export the current canvas as an image
 */
export async function exportCanvasAsImage(
  render: Matter.Render,
  options: ExportOptions = {}
): Promise<Blob> {
  const {
    format = 'png',
    quality = 0.95,
    scale = 1,
    backgroundColor = '#0f172a', // slate-900
  } = options;

  const canvas = render.canvas;
  
  // Create a temporary canvas for export with higher resolution
  const exportCanvas = document.createElement('canvas');
  const ctx = exportCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set dimensions with scale factor
  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  // Scale context for higher resolution
  ctx.scale(scale, scale);

  // Draw the original canvas
  ctx.drawImage(canvas, 0, 0);

  // Convert to blob
  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality
    );
  });
}

/**
 * Download exported image
 */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export current simulation as PNG
 */
export async function exportAsPNG(
  render: Matter.Render,
  filename: string = `newton-ai-${Date.now()}.png`
): Promise<void> {
  const blob = await exportCanvasAsImage(render, { format: 'png' });
  downloadImage(blob, filename);
}

/**
 * Export current simulation as JPG
 */
export async function exportAsJPG(
  render: Matter.Render,
  filename: string = `newton-ai-${Date.now()}.jpg`,
  quality: number = 0.95
): Promise<void> {
  const blob = await exportCanvasAsImage(render, { format: 'jpg', quality });
  downloadImage(blob, filename);
}

/**
 * Export simulation code as text file
 */
export function exportCode(code: string, filename: string = `simulation-${Date.now()}.js`): void {
  const blob = new Blob([code], { type: 'text/javascript' });
  downloadImage(blob, filename);
}

/**
 * Copy canvas to clipboard
 */
export async function copyToClipboard(render: Matter.Render): Promise<void> {
  const blob = await exportCanvasAsImage(render, { format: 'png' });
  
  if (navigator.clipboard && ClipboardItem) {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
  } else {
    throw new Error('Clipboard API not supported');
  }
}
