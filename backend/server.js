const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

// Array to store drawing data
let drawingData = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send the current drawing data to the new user
  socket.emit("load-drawing", drawingData);

  // Listen for new drawing data
  socket.on("draw", (data) => {
    // Store the drawing data
    drawingData.push(data);
    // Broadcast the new drawing data to all other clients
    socket.broadcast.emit("draw", data);
  });

  // Listen for new drawing data
  socket.on("reset", (data) => {
    // Store the drawing data
    drawingData = data;
    
    // Broadcast the new drawing data to all other clients
    socket.broadcast.emit("reset", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
