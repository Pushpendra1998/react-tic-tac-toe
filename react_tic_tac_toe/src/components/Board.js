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
            play_with_bot: false,
            game_start: false,
            difficulty: 'easy'
        }
    }

    handleClick(i) {
        const squares = this.state.history[this.state.history.length - 1].squares.slice();
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            squares: squares,
            history: this.state.history.concat({ squares: squares }),
            xIsNext: !this.state.xIsNext,
            game_start: true
        }, () => {
            setInterval(() => {
                // bot next move.
                if (this.state.play_with_bot && !this.state.xIsNext) {
                    let randomIndex = this.botAvailableMove()
                    this.handleClick(randomIndex)
                }
            }, 1000)

        });
    }

    botAvailableMove() {
        let available_index = this.state.squares.map((value, index) => {
            if (!value) { return index }
            else { return false }
        })

        let filter_index = available_index.filter((value) => {
            if (value === 0 || value) return true
        })

        let randomIndex = filter_index[Math.floor(Math.random() * filter_index.length)];

        return randomIndex
    }

    handleHistory(index) {
        this.state.history.splice(index + 1)
        this.setState({
            history: this.state.history,
            xIsNext: index % 2 !== 0 ? false : true,
            game_start: index === 0 ? false : true
        })
    }

    renderBox(i, nameClass) {
        let game_state = this.state.history[this.state.history.length - 1].squares;
        return <Box id={i} nameClass={nameClass} value={game_state[i]}
            onClick={() => { this.handleClick(i) }} />;
    }

    boardStyle = {
        margin: '5% 0% 0% 0%',
        textAlign: 'center',
        width: '60%',
    }

    historyStyle = {
        margin: '5% 0% 0% 0%',
        textAlign: 'center',
    }

    rootDiv = {
        display: 'flex'
    }

    historyDiv = {
        display: 'grid'
    }

    historyButtons = {
        margin: '0px 0px 5px 0px'
    }

    gameSetting = {
        width: '20%',
        textAlign: 'center',
        margin: '5% 0% 0% 0%',
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

    handlePlayWithBot(ev) {
        this.setState({
            play_with_bot: ev.target.checked
        })
    }

    handleGameDifficulty(ev) {
        this.setState({
            difficulty: ev.currentTarget.id
        })
    }

    render() {
        const winner = this.calculateWinner(this.state.history[this.state.history.length - 1].squares.slice());
        let status;
        if (winner) {
            status = 'winner is ' + winner;
        }
        else if (this.state.history.length === 10) {
            status = 'Game Draw !!!!'
        }
        else {
            status = 'Player ' + (this.state.xIsNext ? 'X' : '0') + ' turn'
        }

        const game_history = this.state.history.map((history, index) => {
            if (index === 0) {
                return <button key={index} style={this.historyButtons} onClick={() => this.handleHistory(index)}>Go to Game Start</button>
            }
            else {
                return <button key={index} style={this.historyButtons} 
                disabled={this.state.play_with_bot && index % 2 !== 0 ? false : true}
                onClick={() => this.handleHistory(index)}>Go to Move : {index}</button>
            }
        })

        let game_difficulty = ''
        if (this.state.play_with_bot) {
            game_difficulty = <>
                <h5>Select difficulty</h5>

                <input type="radio" name="gameDifficulty" id="easy" checked={this.state.difficulty === 'easy'}
                    onChange={(ev) => this.handleGameDifficulty(ev)} disabled={this.state.game_start}></input>
                <label htmlFor="easy">Easy</label>

                <input type="radio" name="gameDifficulty" id="medium" checked={this.state.difficulty === 'medium'}
                    onChange={(ev) => this.handleGameDifficulty(ev)} disabled={this.state.game_start}></input>
                <label htmlFor="medium">Medium</label>

                <input type="radio" name="gameDifficulty" id="hard" checked={this.state.difficulty === 'hard'}
                    onChange={(ev) => this.handleGameDifficulty(ev)} disabled={this.state.game_start}></input>
                <label htmlFor="hard">Hard</label>
            </>
        }

        return (
            <div style={this.rootDiv}>
                <div style={this.gameSetting}>
                    <h3>Game Setting</h3>
                    <input id="play_with_bot" type="checkbox" disabled={this.state.game_start} checked={this.state.play_with_bot} onChange={(ev) => this.handlePlayWithBot(ev)} />
                    <label htmlFor="play_with_bot">Play with bot</label>
                    {game_difficulty}
                </div>
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

