import React, { useState, useCallback, useRef } from "react";
import "./Board.css";
import { Patterns } from "./Patterns";
import Cell from "./Cell";
import produce from "immer";


// todo:
// add drop down menu with possible configurations for user to start with
// add drop down menu or bar that user can adjust board size with
// implement color themes
// refactor and re-organize code
    // add comments above all functions and some logic for colleqgue 
    // rename variables and function names 
    // refactor functions and logic 


//board sizes menu
//25, 50, 75, 100
let patterns = [
  "random", "glider", 
  "glider gun","pulsar", 
  "spaceship","R-pentomino",
  "diehard","unnamed","clear board"];


let genCounter = 0;
let speedMap = {slow: 200, medium: 100, fast: 50};
let colorMap = {
  one:   {primary: "#5EB200", secondary: "#004366", grid: "#00324D"},
  two:   {primary: "#F4A300", secondary: "#660004", grid: "#4D0003"},
  three: {primary: "#43004C", secondary: "#E6FFD7", grid: "#B6FF8B"},
  four:  {primary: "#CACACA", secondary: "#282828", grid: "#323232"},
};

function Board(props) {
  const [generation, setGeneration] = useState(0);
  const [boardsize, setBoardSize] = useState(25);
  const [pattern, setPattern] = useState(patterns);
  const [running, setRunning] = useState(false);
  const [interval, setInterval] = useState(100);
  const [boardcolor, setboardColor] = useState(colorMap.one.primary);
 

  const [cells, setCells] = useState(() => {
    let board = [];
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
   
    genCounter += 1;
    setGeneration(genCounter);
    setTimeout(runIteration, interval);
  }, [interval, calculateNeighbors, boardsize]);

  function stop() {
    setRunning(!running);
    //stops the simulation and leaves the state where it was stopped
    setTimeout(null);
  }

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
    setGeneration(0);
  }

  //Advances board and generation count by one
  function advanceOneGeneration() {
    stop();
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
    genCounter += 1;
    setGeneration(genCounter);
  }


  function changeColorScheme(event){
    var value = event.target.value;
    setboardColor({ primaryColor:   colorMap[value].primary, 
                    secondaryColor: colorMap[value].secondary, 
                    gridLineColor:  colorMap[value].grid })
  }

   //Changes sim speed according to button press
  function changeSimSpeed(event){
    var id = event.target.value;
    let simSpeed = speedMap[id];
    setInterval(simSpeed);
  }

  function changePattern(event){

  }


  return (
    <>
    <div className='Board-title'>
      <div className='neon-orange'>Conway's Game</div>
      <div className='neon-blue'>Of Life</div>
    </div>
    <div className="container">
      
        <div className="Rules">
          <h2>The Rules</h2>
          <h3 className="text-title">For a space that is 'alive' or 'populated'</h3>
          <p className="text">
            Each cell with one or no neighbors dies, as if by solitude. Each cell
            with four or more neighbors dies, as if by overpopulation. Each cell
            with two or three neighbors survives.
          </p>
          <h3 className="text-title">For a space that is 'dead' or 'unpopulated'</h3>
          <p className="text">
            Each cell with exactly three neighbors (no more, no less) becomes
            'alive' populated.
          </p>
          {makeEmptyTable()}
        </div>

        <div id="controls">
          <button className="btn control" id="run" onClick={start}>Run</button>
          <button className="btn control" id="step" onClick={advanceOneGeneration}>Step</button>          
          <button className="btn control" id="pause" onClick={stop}>Stop</button>
          <button className="btn" id="reset" onClick={clear}>Reset</button>
          <select id="speed-select" onChange={changeSimSpeed}>
            <option value="slow">Slow</option>
            <option value="medium" selected="selected">Medium</option>
            <option value="fast">Fast</option>
          </select>
          {/* <select id="color-scheme" onChange={changeColorScheme} style={{backgroundColor: boardcolor, color: boardcolor === "#CACACA" ? "#2E2E2E" : "#FFFFFF"}}>
            <option value="one">Theme #1</option>
            <option value="two">Theme #2</option>
            <option value="three">Theme #3</option>
            <option value="four">Theme #4</option>
          </select>
          <select id="pattern" onChange={changePattern} 
                  style={{backgroundColor: "grey"}}>
            <option value="one">Random</option>
            <option value="two">Glider</option>
            <option value="three">Glider Gun</option>
            <option value="four">Pulsar</option>
            <option value="five">Spaceship</option>
            <option value="six">R-pentomino</option>
            <option value="seven">Diehard</option>
            <option value="eight">Unnamed</option>
          </select> */}
        </div>
        <div id="gen-box">  
          <p id="generation">Generation: {generation}</p>
        </div> 
        
    </div>
        <div className="Explanation">
          <h2>The Game</h2>
          <p className="text">
            The Game of Life is not your typical computer game. It is a
            'cellular automaton', and was invented by Cambridge mathematician
            John Conway. This game became widely known when it was mentioned in
            an article published by Scientific American in 1970. It consists of
            a collection of cells which, based on a few mathematical rules, can
            live, die or multiply. Depending on the initial conditions, the
            cells form various patterns throughout the course of the game.
          </p>
          <p className="text-center"><a href="https://www.youtube.com/watch?v=E8kUJL04ELA">Interview with John Conway</a></p>		
        </div>
    </>
  );
}

export default Board;


