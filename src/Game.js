import React, { Component } from 'react';


function Square(props) {
    return (
        <button className="square"
            onClick={props.onClick}>
            <span>{props.mark}</span>
        </button>
    )
}


class Board extends Component {
    renderSquare(i) {
        return (<Square key={i} index={i} mark={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />);
    }

    renderBoard(length) {
        const rows = [];
        for (let row = 0; row < length; row++) {
            const tempRow = [];
            for (let col = 0; col < length; col++) {
                tempRow.push(this.renderSquare(row * length + col));
            }
            rows.push(<div key={row} className="board-row">{tempRow}</div>);
        }
        return (
            <div className="board">{rows}</div>
        );
    }

    renderPrompt() {
        const content = this.props.winner;
        return (
            <h2 className="info">{content}</h2>
        )
    }

    render() {
        return (
            <div>
                {this.renderPrompt()}
                {this.renderBoard(3)}
            </div>
        )
    }
}


export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            isNextX: true,
            currentStep: 0
        };
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.currentStep + 1);
        const current = history[this.state.currentStep];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            console.log("Clicked");
            return;
        }

        squares[i] = this.state.isNextX ? "X" : "O";
        this.setState({ history: history.concat([{ squares: squares }]),
        currentStep: this.state.currentStep + 1,
        isNextX: !this.state.isNextX,
        winner: calculateWinner(squares) });
    }

    jumpTo(step) {
        this.setState({
            currentStep: step,
            isNextX: (step % 2) == 0,
        })
    }

    reset() {
        this.setState({
            history: [{
                squares: Array(9).fill(null)
            }],
            isNextX: true,
            currentStep: 0,
            winner: null
        })
    }

    renderHistory() {
        const history = this.state.history.map((squares, index) => {
            const desc = (index == 0) ? "Start of game" : "Go to move #" + index;
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)}>{desc}</button>
                </li>
            )
        });
        return history;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.currentStep];
        const winner = calculateWinner(current.squares);
        let info = winner ? winner + " Victory!" : "Next Turn: " + (this.state.currentStep % 2 == 0 ? "X" : "O");
        if (history.length == 10 && !winner) {
            info = "Draw";
        }

        return (
            <div className="game">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)} />
                <div className="game-info">
                    <p>{info}</p>
                </div>

                <button className="reset" onClick={() => this.reset()}>Reset</button>

                <ol>
                    {this.renderHistory()}
                </ol>
            </div>)
    }
}




function calculateWinner(squares) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (squares[a] !== null && squares[a] === squares[b] && squares[b] == squares[c]) {
            return squares[a];
        }
    }

    return null;
}