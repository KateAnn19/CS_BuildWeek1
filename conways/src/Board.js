import React, {useState} from "react";
import Cell from "./Cell";
import './Board.css';

//board sizes
//25, 50, 75, 100



function Board(props) {
  const [cells, setCells] = useState([]);
  const [generation, setGeneration] = useState(0);
  const [boardsize, setBoardSize] = useState(createBoard());

  const nrows = 25;
  const ncols = 25; 

  function createBoard() {
    let board = [];
    // TODO: create array-of-arrays of true/false values
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        row.push(false);
      }
      board.push(row);
    }
    return board;
  }
  

  function makeEmptyTable(){
    let rows = []
    for(var i = 0; i< boardsize; i++){
      let rowID = `row${i}`
      let cell = []
      for(var idx = 0; idx < boardsize; idx++){
        let cellID = `cell${i}-${idx}`
        cell.push(<td key={cellID} id={cellID}></td>)
      }
    rows.push(<tr key={i} onClick={handleClick} id={rowID}>{cell}</tr>)
    }
    return rows;
  }
  

    return(
      <div className="container">
        <div className="Rules">
        <h2>The Rules</h2>
        <h3>For a space that is 'alive' or 'populated'</h3>
        <p>Each cell with one or no neighbors dies, as if by solitude.
            Each cell with four or more neighbors dies, as if by overpopulation.
            Each cell with two or three neighbors survives.</p>
        <h3>For a space that is 'dead' or 'unpopulated'</h3>
            <p>Each cell with exactly three neighbors (no more, no less) becomes 'alive' populated.</p>
        </div>
        <div className="row">
          <div className="col s12 board">
            <table id="game-board">
              <tbody>
                {makeEmptyTable()}
              </tbody>
            </table>
          </div>
        </div>
        <button>Start</button>
        <button>Stop</button>
        <button>Pause</button>
        <h3>Generation: {generation}</h3>
        <div className="Explanation"><h2>The Game</h2>
        <p>The Game of Life is not your typical computer game. It is a 'cellular automaton', and was invented by Cambridge mathematician John Conway.
        This game became widely known when it was mentioned in an article published by Scientific American in 1970. It consists of a collection of cells which, based on a few mathematical rules, can live, die or multiply. Depending on the initial conditions, the cells form various patterns throughout the course of the game.</p></div>
      </div>
    )

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
