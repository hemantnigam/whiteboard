// Undo function
export const undo = (drawings, undoStack, redoStack, redrawCanvas) => {
  const lastDrawing = undoStack.current.pop();
  if (lastDrawing) {
    redoStack.current.push(lastDrawing); // Push to redo stack
    drawings.current.pop(); // Remove from drawings array
    redrawCanvas();
  }
};

// Redo function
export const redo = (drawings, undoStack, redoStack, redrawCanvas) => {
  const lastUndone = redoStack.current.pop();
  if (lastUndone) {
    undoStack.current.push(lastUndone); // Push to undo stack
    drawings.current.push(lastUndone); // Re-add to drawings array
    redrawCanvas();
  }
};

// Reset canvas
export const resetCanvas = (drawings, undoStack, redoStack, redrawCanvas) => {
  drawings.current = [];
  undoStack.current = [];
  redoStack.current = [];
  redrawCanvas();
};

export const downloadImage = (canvasRef) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Create an offscreen canvas
  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");

  // Set the offscreen canvas size to match the original canvas
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;

  // Fill the offscreen canvas with the background color
  offscreenCtx.fillStyle = "#FFFFFF"; // Set your desired background color here (white in this example)
  offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  // Copy the original canvas content to the offscreen canvas
  offscreenCtx.drawImage(canvas, 0, 0);

  // Convert the offscreen canvas to a PNG image data URL
  const dataUrl = offscreenCanvas.toDataURL("image/png");

  // Create a temporary anchor element for downloading
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "canvas-drawing.png"; // Set the download file name

  // Trigger the click event to start the download
  link.click();
};
