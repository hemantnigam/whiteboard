# Collaborative Whiteboard

A real-time collaborative whiteboard application where multiple users can draw on a shared canvas simultaneously. Built with **HTML5 Canvas**, **React**, **Socket.IO**, and **Next.js**, this application enables users to see each other’s drawings as they happen and includes a variety of tools for enhanced usability.

## Features

- **Real-Time Collaboration**: Allows multiple users to draw on the same canvas and see each other's changes in real time.
- **Drawing Tools**:
  - **Free Draw**: Draw freely on the canvas.
  - **Shapes**: Draw shapes like circles, rectangles, lines, rhombus etc.
  - **Text**: Add custom text to the canvas.
  - **Line Width**: Adjust the line width to customize drawing.
  - **Color Picker**: Choose from various colors.
  - **Reset**: Reset or clear the canvas.
  - **Undo**: Undo drawings added in the canvas.
  - **Redo**: Redo drawings added in the canvas.
- **Persistent Canvas**: New users can see previous drawings when they join, enabling continuity in the collaborative environment.

## Tech Stack

- **Frontend**: React, HTML5 Canvas
- **Backend**: Node.js, Socket.IO
- **Real-Time Communication**: WebSockets with Socket.IO
- **Deployment**: Vite.js for fast builds and deployment

## Directory Structure

- **/frontend**: Contains the frontend code for the React.js application.
- **/backend**: Contains the backend server code using Socket.IO.

## Usage

1. Open the hosted link in your browser.
2. Start drawing on the whiteboard using available tools.
3. Invite others to join the same link for real-time collaboration.

## Future Improvements

- **Authentication**: Adding user authentication for a more personalized experience.
- **Dashboard**: Allow users to create multiple canvas and can see on users dashboard.
- **Canvas session**: Allow users to create a new canvas and able to generate a unique link to invite users.
- **Save & Load Drawings**: Enable users to save and load previous drawings.
- **Voice & Text Chat**: Add options for users to communicate directly in-app.
