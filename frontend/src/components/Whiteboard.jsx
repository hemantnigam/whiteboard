import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";
import { DEFAULT_COLOR, SERVER_URL, TOOLS } from "../constants/tools";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [lineWidth, setLineWidth] = useState(2);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [fontSize, setFontSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [text, setText] = useState("");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSidebarText, setShowSidebarText] = useState(false);

  const socket = useRef(null); // server URL

  const drawings = useRef([]); // Array to hold all drawing objects for persistence
  const currentPath = useRef([]); // Array to hold points for the current free draw path

  // Stacks for undo and redo
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  useEffect(() => {
    socket.current = io(SERVER_URL);
    const ctx = canvasRef.current.getContext("2d");

    // Load previous drawings on connection
    socket.current.on("load-drawing", (drawingData) => {
      drawings.current = drawingData;
      redrawCanvas(ctx);
    });

    // Listen for incoming drawing data
    socket.current.on("draw", (data) => {
      console.log(data);
      if (data.tool === TOOLS.PENCIL) {
        currentPath.current = data.path; // Redraw the free draw path
      } else {
        drawings.current.push(data);
      }
      drawOnCanvas(data, ctx);
    });

    // Listen for incoming drawing data
    socket.current.on("reset", (data) => {
      drawings.current = data;
      redrawCanvas()
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleDrawStart = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setStartPos({ x: offsetX, y: offsetY });

    if (tool === TOOLS.PENCIL) {
      currentPath.current = [{ x: offsetX, y: offsetY }];
    } else if (tool === TOOLS.TEXT) {
      const textData = {
        tool,
        color,
        lineWidth,
        fontSize,
        text,
        x: offsetX,
        y: offsetY,
      };
      drawings.current.push(textData);
      undoStack.current.push(textData);
      drawOnCanvas(textData);
      socket.current.emit("draw", textData);
    }
  };

  const handleDrawMove = (e) => {
    if (!isDrawing || tool === TOOLS.TEXT) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");

    if (tool === TOOLS.PENCIL) {
      currentPath.current.push({ x: offsetX, y: offsetY }); // Add each point to the path
      redrawCanvas(ctx); // Redraw everything on each move
      drawOnCanvas(
        { tool: TOOLS.PENCIL, color, lineWidth, path: currentPath.current },
        ctx,
        true
      ); // Smooth free draw
    } else if (
      [
        TOOLS.RECTANGLE,
        TOOLS.CIRCLE,
        TOOLS.LINE,
        TOOLS.RHOMBUS,
        TOOLS.ARROW,
      ].includes(tool)
    ) {
      redrawCanvas(ctx); // Clear canvas and redraw previous drawings for a temporary shape preview
      drawOnCanvas(
        {
          tool,
          color,
          lineWidth,
          x: startPos.x,
          y: startPos.y,
          endX: offsetX,
          endY: offsetY,
        },
        ctx,
        true
      );
    }
  };

  const handleDrawEnd = (e) => {
    setIsDrawing(false);
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === TOOLS.PENCIL && currentPath.current.length) {
      const pathData = {
        tool: TOOLS.PENCIL,
        color,
        lineWidth,
        path: [...currentPath.current],
      };
      drawings.current.push(pathData);
      socket.current.emit("draw", pathData);
      currentPath.current = [];
      undoStack.current.push(pathData); // Save to undo stack
      redoStack.current = []; // Clear redo stack on new action
    } else if (
      [
        TOOLS.RECTANGLE,
        TOOLS.CIRCLE,
        TOOLS.LINE,
        TOOLS.RHOMBUS,
        TOOLS.ARROW,
      ].includes(tool)
    ) {
      const shapeData = {
        tool,
        color,
        lineWidth,
        x: startPos.x,
        y: startPos.y,
        endX: offsetX,
        endY: offsetY,
      };
      drawings.current.push(shapeData);
      socket.current.emit("draw", shapeData);
      undoStack.current.push(shapeData); // Save to undo stack
      redoStack.current = []; // Clear redo stack on new action
      redrawCanvas();
    }
  };

  const drawArrow = (x, y, endX, endY, ctx) => {
    const angle = Math.atan2(endY - y, endX - x);
    const length = Math.sqrt((endX - x) ** 2 + (endY - y) ** 2);
    const arrowHeadLength = 10; // Length of the arrow head
    const arrowAngle = Math.PI / 6; // Angle for the arrow head

    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY); // Draw the main line of the arrow

    // Draw arrowhead
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowHeadLength * Math.cos(angle - arrowAngle),
      endY - arrowHeadLength * Math.sin(angle - arrowAngle)
    );

    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowHeadLength * Math.cos(angle + arrowAngle),
      endY - arrowHeadLength * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  };

  const drawRhombus = (x, y, endX, endY, ctx) => {
    const width = endX - x;
    const height = endY - y;

    const topX = x + width / 2;
    const topY = y;
    const rightX = x + width;
    const rightY = y + height / 2;
    const bottomX = x + width / 2;
    const bottomY = y + height;
    const leftX = x;
    const leftY = y + height / 2;

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(rightX, rightY);
    ctx.lineTo(bottomX, bottomY);
    ctx.lineTo(leftX, leftY);
    ctx.closePath();
    ctx.stroke();
  };

  const drawOnCanvas = (
    data,
    ctx = canvasRef.current.getContext("2d"),
    isTemporary = false
  ) => {
    ctx.lineWidth = data.lineWidth;
    ctx.strokeStyle = data.color;
    ctx.fillStyle = data.color;
    ctx.beginPath();

    if (data.tool === TOOLS.PENCIL) {
      // Draw smooth line by connecting each point in the path
      data.path.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    } else {
      switch (data.tool) {
        case TOOLS.RECTANGLE:
          ctx.strokeRect(
            data.x,
            data.y,
            data.endX - data.x,
            data.endY - data.y
          );
          break;
        case TOOLS.CIRCLE:
          const radius = Math.sqrt(
            (data.endX - data.x) ** 2 + (data.endY - data.y) ** 2
          );
          ctx.arc(data.x, data.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case TOOLS.LINE:
          ctx.moveTo(data.x, data.y);
          ctx.lineTo(data.endX, data.endY);
          ctx.stroke();
          break;
        case TOOLS.ARROW:
          drawArrow(data.x, data.y, data.endX, data.endY, ctx);
          break;
        case TOOLS.RHOMBUS:
          drawRhombus(data.x, data.y, data.endX, data.endY, ctx);
          break;
        case TOOLS.TEXT:
          ctx.font = `${data.fontSize}px Arial`; // Use font size for text
          ctx.fillText(data.text, data.x, data.y);
          break;
        default:
          break;
      }
    }

    if (!isTemporary) ctx.closePath();
  };

  const redrawCanvas = (ctx = canvasRef.current.getContext("2d")) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas
    drawings.current.forEach((data) => drawOnCanvas(data, ctx)); // Redraw all saved drawings
  };

  // Undo function
  const undo = () => {
    const lastDrawing = undoStack.current.pop();
    if (lastDrawing) {
      redoStack.current.push(lastDrawing); // Push to redo stack
      drawings.current.pop(); // Remove from drawings array
    }
    socket.current.emit("reset", drawings.current);
    redrawCanvas();
  };

  // Redo function
  const redo = () => {
    const lastUndone = redoStack.current.pop();
    if (lastUndone) {
      undoStack.current.push(lastUndone); // Push to undo stack
      drawings.current.push(lastUndone); // Re-add to drawings array
    }
    socket.current.emit("reset", drawings.current);
    redrawCanvas();
  };

  // Reset canvas
  const resetCanvas = () => {
    drawings.current = [];
    undoStack.current = [];
    redoStack.current = [];
    socket.current.emit("reset", drawings.current);
    redrawCanvas();
  };

  return (
    <div className="whiteboard">
      <Toolbar
        setTool={setTool}
        setShowSidebar={setShowSidebar}
        setShowSidebarText={setShowSidebarText}
        drawings={drawings}
        undoStack={undoStack}
        redoStack={redoStack}
        undo={undo}
        redo={redo}
        resetCanvas={resetCanvas}
        ref={canvasRef}
      />
      <Sidebar
        lineWidth={lineWidth}
        color={color}
        setLineWidth={setLineWidth}
        setColor={setColor}
        setText={setText}
        fontSize={fontSize}
        showSidebar={showSidebar}
        showSidebarText={showSidebarText}
        setFontSize={setFontSize}
      />
      <Canvas
        ref={canvasRef}
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawMove}
        onMouseUp={handleDrawEnd}
      />
    </div>
  );
};

export default Whiteboard;
