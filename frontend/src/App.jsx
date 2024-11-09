import React from "react";
import Whiteboard from "./components/Whiteboard";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Collaborative Whiteboard</h1>
      </header>
      <Whiteboard />
    </div>
  );
}

export default App;
