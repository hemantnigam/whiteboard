import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Initialize the Socket.IO client
const socket = io("https://whiteboard-lvj0.onrender.com");

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Set up the canvas context
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;

    // Load previous drawing data on initial connection
    socket.on("load-drawing", (drawingData) => {
      drawingData.forEach((data) => {
        const { x0, y0, x1, y1 } = data;
        drawLine(x0, y0, x1, y1, false);
      });
    });

    // Listen for new drawing data from other users
    socket.on("draw", ({ x0, y0, x1, y1 }) => {
      drawLine(x0, y0, x1, y1, false);
    });

    return () => {
      socket.off("load-drawing");
      socket.off("draw");
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, emit) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0);
    contextRef.current.lineTo(x1, y1);
    contextRef.current.stroke();
    contextRef.current.closePath();

    if (!emit) return;
    socket.emit("draw", { x0, y0, x1, y1 });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.x = offsetX;
    contextRef.current.y = offsetY;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = contextRef.current;

    drawLine(x, y, offsetX, offsetY, true);
    contextRef.current.x = offsetX;
    contextRef.current.y = offsetY;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: "1px solid #000" }}
    />
  );
};

export default Whiteboard;
