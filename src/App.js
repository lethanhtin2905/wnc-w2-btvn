import React from "react";
import './App.css'

function Square(props) {
    return (
        <button className={`${props.winnerClass} square`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Board(props) {
    const createBoard = (row, col) => {
        const board = [];
        let cellCounter = 0;

        for (let i = 0; i < row; i += 1) {
            const columns = [];
            for (let j = 0; j < col; j += 1) {
                columns.push(renderSquare(cellCounter));
                cellCounter++;
            }
            board.push(<div key={i} className="board-row">{columns}</div>);
        }

        return board;
    }

    const renderSquare = (i) => {
        const winnerClass =
            props.winnerSquares &&
                (props.winnerSquares[0] === i || props.winnerSquares[1] === i || props.winnerSquares[2] === i)?'square-winner' : '';
        return (
            <Square
                winnerClass={winnerClass}
                key={i}
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        )
    };

    return (
        <div>{createBoard(3, 3)}</div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            currentStepNumber: 0,
            xIsNext: true,
            isSort: false
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (checkWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    currentLocation: getLocation(i),
                    stepNumber: history.length,
                },
            ]),
            currentStepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            currentStepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    sortMoves() {
        this.setState({
            isSort: !this.state.isSort
        })
    }

    reset() {
        this.setState({
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            currentStepNumber: 0,
            xIsNext: true,
            isSort: false
        });
    }

    render() {
        const { history, currentStepNumber, isSort } = this.state;
        const current = history[this.state.currentStepNumber];
        const { winner, winnerRow } = checkWinner(current.squares);

        const moves = history.map((step, move) => {
            const currentLocation = step.currentLocation ? `(${step.currentLocation})` : '';
            const desc = step.stepNumber ? `Go to move #${step.stepNumber}` : 'Go to game start';
            return (
                <li key={move}>
                    <button
                        className={move === currentStepNumber ? 'btn btn-current' : 'btn'}
                        onClick={() => this.jumpTo(move)}>
                        {`${desc} ${currentLocation}`}
                    </button>
                </li>
            );
        });

        let status;

        if (winner) {
            status = `Winner: ${winner}`;
        } else if (history.length === 10) {
            status = 'Ohhh! No one won.';
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        return (
            <div className="container">
                <div className="game">
                    <div className="game-main">
                        <h1 className="game-name">Tic-Tac-Toe</h1>
                        <div className="game-result">{status}</div>
                        <button className="btn btn-new-game" onClick={() => this.reset()}>
                            New game
                        </button>
                        <div className="game-board">
                            <Board
                                squares={current.squares}
                                winnerSquares={winnerRow}
                                onClick={i => this.handleClick(i)}
                            />
                        </div>
                    </div>

                    <div className="game-history">
                        <h2>History</h2>
                        <hr />
                        <button className="btn btn-sort" onClick={() => this.sortMoves()}>
                            Sort moves
                        </button>
                        <div className="move-history">{isSort ? moves.reverse() : moves}</div>
                    </div>

                </div>
            </div>
        );
    }
}

function checkWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winnerRow: lines[i]
            };
        }
    }
    return {
        winner: null,
        winnerRow: null
    };
}
const getLocation = (move) => {
    const locationMap = {
        0: "1, 1",
        1: "1, 2",
        2: "1, 3",
        3: "2, 1",
        4: "2, 2",
        5: "2, 3",
        6: "3, 1",
        7: "3, 2",
        8: "3, 3",
    };

    return locationMap[move];
};

export default Game;
