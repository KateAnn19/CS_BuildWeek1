import React, {useState} from "react";


function BoardView (props) { 
    var intersections = [];
    for (var i = 0; i < props.board.size; i++)
      for (var j = 0; j < props.board.size; j++)
        intersections.push(BoardIntersection({
          board: props.board,
          color: props.board.board[i][j],
          row: i,
          col: j,
          onPlay: props.onPlay
        }));
    var style = {
      width: props.board.size * GRID_SIZE,
      height: props.board.size * GRID_SIZE
    };
    return <div style={style} id="board">{intersections}</div>;
};

export default BoardView;