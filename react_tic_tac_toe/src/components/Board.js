import React, { Component } from 'react'
import Box from './Box';

export class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            squares: Array(9).fill(null),
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            xIsNext: true,
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            squares: squares,
            history: this.state.history.concat({squares: squares}),
            xIsNext: !this.state.xIsNext
        });
    }

    renderBox(i, nameClass) {
        let game_state = this.state.history[this.state.history.length - 1].squares;
        return <Box id={i} nameClass={nameClass} value={game_state[i]}
            onClick={() => { this.handleClick(i) }} />;
    }

    boardStyle = {
        margin: '5% -5% 0% 10%',
        textAlign: 'center',
        width: '65%',
    }

    historyStyle = {
        margin: '5% auto 0 0',
    }

    rootDiv = {
        display:'flex'
    }

    historyDiv = {
        display: 'grid'
    }

    historySpan = {
        maring: '0px 0px 5px 0px'
    }

    calculateWinner(squares) {
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
                return squares[a];
            }
        }
        return null;
    }

    render() {
        const winner = this.calculateWinner(this.state.squares);
        let status;
        if(winner){
            status = 'winner is ' + winner;
        }
        else{
            status = 'Player ' + (this.state.xIsNext ? 'X' : '0') + ' turn'
        }
        const game_history = this.state.history.map((history, index)=>{
            if (index === 0){
                return <span key={index} style={this.historySpan}>Game Start</span>
            }
            else{
                return <span key={index} style={this.historySpan}>Move : {index}</span>
            }
        })
        
        return (
            <div style={this.rootDiv}>
                <div id="container" style={this.boardStyle}>
                    <h2>{status}</h2>
                    <div className="block">
                        {this.renderBox(0, "box top left")}
                        {this.renderBox(1, "box top middle")}
                        {this.renderBox(2, "box top right")}
                    </div>
                    <div className="block">
                        {this.renderBox(3, "box left")}
                        {this.renderBox(4, "box middle")}
                        {this.renderBox(5, "box right")}
                    </div>
                    <div className="block">
                        {this.renderBox(6, "box bottom left")}
                        {this.renderBox(7, "box bottom middle")}
                        {this.renderBox(8, "box bottom right")}
                    </div>
                </div>
                <div style={this.historyStyle}>
                    <h3>History</h3>
                    <div style={this.historyDiv}>
                        {game_history}
                    </div>
                </div>
            </div>
        )
    }
}

export default Board

