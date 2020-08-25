import React, {useState} from "react";
import Cell from "./Cell";
import './Board.css';



function Board(props) {
  const [boardsize, setBoardsize] = useState(25);
    // TODO: set initial state

    let rows = []
    for(var i = 0; i< boardsize; i++){
      let rowID = `row${i}`
      let cell = []
      for(var idx = 0; idx < boardsize; idx++){
        let cellID = `cell${i}-${idx}`
        cell.push(<td key={cellID} id={cellID}></td>)
      }
      rows.push(<tr key={i} id={rowID}>{cell}</tr>)
    }

    return(
      <div className="container">
        <div className="row">
          <div className="col s12 board">
            <table id="game-board">
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
        <button>Start</button>
        <button>Stop</button>
        <button>Pause</button>
        <h2>The Rules</h2>
        <h3>For a space that is 'alive' or 'populated'</h3>
        <p>Each cell with one or no neighbors dies, as if by solitude.
            Each cell with four or more neighbors dies, as if by overpopulation.
            Each cell with two or three neighbors survives.</p>
        <h3>For a space that is 'dead' or 'unpopulated'</h3>
            <p>Each cell with exactly three neighbors (no more, no less) becomes populated.</p>
      </div>
    )

}

export default Board;