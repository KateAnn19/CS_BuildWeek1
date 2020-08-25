import React from 'react'
import './Cell.css';



function Cell(props) {
    
    function handleClick(evt){
        props.flipCellsAroundMe();
    }


    let classes = "Cell" + (props.isLit ? " Cell-lit" : "");
    return (
      <td className={classes} onClick={handleClick}/>
    );
  }
  

export default Cell