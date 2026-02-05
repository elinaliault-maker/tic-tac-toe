import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
  <button 
    className="square" 
    onClick={onSquareClick}
  >
    {value}
  </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // because null is falsy but X and O are truthy so if filled do the return
    // or if there is already a winner
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    // if its null than fill it by the correct value
    const nextSquares = squares.slice();
    
    if(xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  const boardGrid = () => {
    let rowSquares = [];
    let boardRows = [];
    let startNumber = 0;
    // pour chaque ligne
    for (let i = 0; i < 3; i++) {
      // pour chaque square
      for (let j = 0; j < 3; j++) {
        let k = startNumber + j;
        rowSquares = [
          ...rowSquares, 
          <Square key={k} value={squares[k]} onSquareClick={() => handleClick(k)} />
        ];
      }
      // add the squares to the row
      boardRows = [
        ...boardRows, 
        <div className="board-row">{rowSquares}</div>
      ];
      // reset
      rowSquares = [];
      startNumber = startNumber + 3;
    }
    return boardRows;
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardGrid()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let tag;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to game start`;
    }

    if (move === history.length - 1) {
      tag = <p>You are at move #{move}</p>;
    } else {
      tag = <button onClick={() => jumpTo(move)}>{description}</button>;
    }

    return (
      <li key={move}>
        {tag}
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}