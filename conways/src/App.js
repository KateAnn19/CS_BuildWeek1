import React from 'react';
import Board from "./Board";
import './App.css';

function App() {
  return (
    <div className="App">
     <h1>Conway's Game of Life</h1>
     <Board/>
    </div>
  );
}

export default App;
