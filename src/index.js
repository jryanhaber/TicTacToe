import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'cirrus-ui';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0
    };
  }

  jumpTo(step) {
    this.setState({
      ...this.state,
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  handleClick(i) {
    // pull history off of state, but ...
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // grab current state off of history
    const current = history[history.length - 1];
    // make a seperate copy of squares off of current history
    const squares = current.squares.slice();
    // stop the game when its won
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // mark off the last move in new state copy
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // load the history with the new state
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      // not sure what this is doing TODO
      stepNumber: history.length,
      // flip who is next
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // upon render calculate the winner if there is one
    const winner = calculateWinner(current.squares);

    // moves will be a function which maps through the history
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <ul key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </ul>
      );
    });
    let status;
    // update the message
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
