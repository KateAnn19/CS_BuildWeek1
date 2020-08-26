import React, { useState, useCallback, useRef } from "react";
import "./Board.css";
import { Patterns } from "./Patterns";
import Cell from "./Cell";
import produce from "immer";

//board sizes menu
//25, 50, 75, 100

// let patterns = [
//   "random", "glider",
//   "glider gun","pulsar",
//   "spaceship","R-pentomino",
//   "diehard","unnamed","clear board"]

const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

let numRows =25;
let numCols = 25;

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

function Board(props) {
  const [generation, setGeneration] = useState(0);
  const [boardsize, setBoardSize] = useState(25);
  const [pattern, setPattern] = useState({});
  const [running, setRunning] = useState(false);
  const [interval, setInterval] = useState(100);
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < boardsize; i++) {
      rows.push(Array.from(Array(boardsize), () => 0));
    }
    return rows;
  });

  const [cells, setCells] = useState(() => {
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < boardsize; y++) {
      let row = [];
      for (let x = 0; x < boardsize; x++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  });


  function createBoard(){
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < boardsize; y++) {
      let row = [];
      for (let x = 0; x < boardsize; x++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  }
  

  function flipLifeState(coord) {
    console.log(coord);
    let newCells;
    let [y, x] = coord.split("-").map(Number);
    newCells = produce(cells, (cellCopy) => {
      cellCopy[y][x] = cells[y][x] ? 0 : 1;
    });

    setCells(newCells);
  }

  function makeEmptyTable() {
    let tblBoard = [];
    for (var i = 0; i < boardsize; i++) {
      let row = [];
      for (var y = 0; y < boardsize; y++) {
        let coord = `${i}-${y}`;
        row.push(
          <Cell
            id={coord}
            key={coord}
            isAlive={cells[i][y]}
            flipLifeState={() => flipLifeState(coord)}
          />
        );
      }
      tblBoard.push(<tr key={i + y}>{row}</tr>);
    }
    return (
      <table className="Board">
        <tbody>{tblBoard}</tbody>
      </table>
    );
  }

  const calculateNeighbors = useCallback(
    (cells, y, x) => {
      let neighbors = 0;
      const dirs = [[-1, -1],[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1]];
      for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        let y1 = y + dir[0];
        let x1 = x + dir[1];
        if (x1 >= 0 && x1 < boardsize && y1 >= 0 && y1 < boardsize && cells[y1][x1]) {
          neighbors++;
        }
      }
      return neighbors;
    },
    [boardsize]
  );

  const runningRef = useRef(running);
  runningRef.current = running;

  //my function 
  const runIteration = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setCells(c => {
      return produce(c, cellCopy => {
        for (let y = 0; y < boardsize; y++) {
          for (let x = 0; x < boardsize; x++) {
            let neighbors = calculateNeighbors(c, y, x);
            if (c[y][x]) {
              if (neighbors === 2 || neighbors === 3) {
                cellCopy[y][x] = 1;
              } else {
                cellCopy[y][x] = 0;
              }
            } else {
              if (!c[y][x] && neighbors === 3) {
                cellCopy[y][x] = 1;
              }
            }
          }
        }
      })
    })
    setTimeout(runIteration, interval);
  }, [interval, calculateNeighbors, boardsize]);

  function stop() {
    setRunning(!running);
    //stops the simulation and leaves the state where it was stopped
    setTimeout(null);
  }


  //his function 
  const runSimulation = useCallback(() => {
    //simulate
    if (!runningRef.current) {
      return;
    }
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let y = 0; y < boardsize; y++) {
          for (let x = 0; x < boardsize; x++) {
            let neighbors = 0;
            operations.forEach(([i,t]) => {
              const newY = y + i;
              const newX = x + t;
              if(newY >= 0 && newY < boardsize && newX >= 0 && newX < boardsize){
                neighbors += g[newY][newX];
              }
            });

            if(neighbors < 2 || neighbors > 3){
              gridCopy[y][x] = 0;
            }else if(g[y][x] === 0 && neighbors === 3){
              gridCopy[y][x] = 1;
            }
          }
        }
      })
    });

    setTimeout(runSimulation, interval);
  }, [boardsize, interval]);


  function start() {
    setRunning(!running);
    if(!running){
      runningRef.current = true;
      runIteration();
    }
  }

  
  function clear() {
    //clears the board and turns all cells dead
    setCells(createBoard);
  }

  function makeGrid() {
    return grid.map((rows, i) =>
      rows.map((col, k) => (
        <div
          key={i + k}
          onClick={() => {
            const newGrid = produce(grid, (gridCopy) => {
              gridCopy[i][k] = grid[i][k] ? 0 : 1;
            });
            setGrid(newGrid);
          }}
          style={{
            width: 20,
            height: 20,
            border: "1px solid black",
            backgroundColor: grid[i][k] ? "pink" : "lightgrey",
          }}
        />
      ))
    );
  }

  return (
    <div className="container">
      <div
        style={{
          justifyContent: "center",
          display: "grid",
          gridTemplateColumns: `repeat(${boardsize}, 20px)`,
        }}
      >{grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px black"
              }}
            />
            )))}
        </div>
      <button onClick={() => {
        setRunning(!running);
        if(!running){
          runningRef.current = true;
          runSimulation();
        }
      }}>{running ? "Stop" : "Start"}</button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      > Clear
      </button>
      <div className="Rules">
        <h2>The Rules</h2>
        <h3>For a space that is 'alive' or 'populated'</h3>
        <p>
          Each cell with one or no neighbors dies, as if by solitude. Each cell
          with four or more neighbors dies, as if by overpopulation. Each cell
          with two or three neighbors survives.
        </p>
        <h3>For a space that is 'dead' or 'unpopulated'</h3>
        <p>
          Each cell with exactly three neighbors (no more, no less) becomes
          'alive' populated.
        </p>
      </div>
      {makeEmptyTable()}
      <div className="controls">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={clear}>Clear Board</button>
        <h3>Generation: {generation}</h3>
        <div className="Explanation">
          <h2>The Game</h2>
          <p>
            The Game of Life is not your typical computer game. It is a
            'cellular automaton', and was invented by Cambridge mathematician
            John Conway. This game became widely known when it was mentioned in
            an article published by Scientific American in 1970. It consists of
            a collection of cells which, based on a few mathematical rules, can
            live, die or multiply. Depending on the initial conditions, the
            cells form various patterns throughout the course of the game.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Board;

// todo:
// add drop down menu with possible configurations for user to start with
// add onClick to start button to start simulation
// add onClick to stop button to stop simulation
// add onClick to pause button to pause simulation
// add drop down menu or bar that user can adjust board size with
// make sure generations of simulation are being calculated with every re-render
// add onClick to every cell
// create logic for cells
// create function for detecting neighbors
// state of board:
//    #each generation
//      #whether cells or dead or alive
