import React from "react";
import "./App.css";
import "./myd3.js";

function App() {
  return (
    <div className="App">
      <div id="title">
        <h1>Temperature Recordings</h1>
      </div>
      <div id="description">Temperature Variance</div>
      <div id="graph"></div>
      <div id="tooltip"></div>
    </div>
  );
}

export default App;
