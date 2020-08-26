import React, {useState} from "react";
import './Cell.css';

function Cell(props) {  
  function handleClick(event) {
    props.flipLifeState();
  }


let classes = "Cell" + (props.isAlive ? " Cell-Alive" : "");
  return (
    <>
      <td className={classes} onClick={handleClick}/>
    </>
  );
}

export default Cell;



//   function makeEmptyTable() {
//     let classes = "Cell" + (this.props.isLit ? " Cell-lit" : "");
//     let rows = [];
//     for (var i = 0; i < boardsize; i++) {
//       let rowID = `row${i}`;
//       let cell = [];
//       for (var idx = 0; idx < boardsize; idx++) {
//         let cellID = `${i}-${idx}`;
//         cell.push(
//           <td
            
//             onClick={handleClick}
//             key={cellID}
//             id={cellID}
//           ></td>
//         );
//       }
//       rows.push(
//         <tr key={i} id={rowID}>
//           {cell}
//         </tr>
//       );
//     }
//     return rows;
//   }
