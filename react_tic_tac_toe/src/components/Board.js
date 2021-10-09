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
            difficulty: 'easy',
            player_x: [],
            player_0: [],
        }
    }

    checkPlayerWin(winning_positions, player){
        var win_pos = false;
        winning_positions.forEach(element => {
            if(player.includes(element[0]) && player.includes(element[1])){
                if(!this.state.squares[element[2]])
                    win_pos = element[2]
            }
            else if(player.includes(element[1]) && player.includes(element[2])){
                if(!this.state.squares[element[0]])
                    win_pos = element[0]
            }
            else if(player.includes(element[0]) && player.includes(element[2])){
                if(!this.state.squares[element[1]])
                    win_pos = element[1]
            }
        });

        // Check if win_pos is occupied
        if(this.state.squares[win_pos] || player.length < 2){
            return false
        }
        return win_pos;
    }

    handleClick(i) {
        const squares = this.state.history[this.state.history.length - 1].squares.slice();
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : '0';
        if(this.state.xIsNext){
            this.setState({
                player_x: this.state.player_x.concat(i)
            })
        }
        else{
            this.setState({
                player_0: this.state.player_0.concat(i)
            })
        }

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
            else
                return null
        })
        
        let randomIndex;
        const winning_positions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        if(this.state.difficulty === 'easy'){
            randomIndex = filter_index[Math.floor(Math.random() * filter_index.length)];
        }
        if(this.state.difficulty === 'hard'){
            // 1. If player 'X' choose the center box
            if(this.state.player_x[0] === 4){
                // 1.1 Bot first move. 
                if(this.state.history.length-1 === 1){
                    console.log('Started with middle box')
                    console.log('Corner occupied by bot')
                    randomIndex = [0, 2, 6, 8][Math.floor(Math.random() * [0, 2, 6, 8].length)]
                }
                // 1.2 check if bot can win
                else if(this.checkPlayerWin(winning_positions, this.state.player_0) === 0 || this.checkPlayerWin(winning_positions, this.state.player_0)){
                    console.log('Bot can win')
                    randomIndex = this.checkPlayerWin(winning_positions, this.state.player_0)
                }

                // 1.3 check if opponent could win
                else if (this.checkPlayerWin(winning_positions, this.state.player_x) === 0 || this.checkPlayerWin(winning_positions, this.state.player_x)){
                    console.log('Opponent can win')
                    randomIndex = this.checkPlayerWin(winning_positions, this.state.player_x)
                }

                // 1.4 check has 2 even number (Special condition)
                else if (this.state.player_x.length === 2 && ((Math.abs(this.state.player_x[1] - this.state.player_0[0]) === 4) || (Math.abs(this.state.player_x[1] - this.state.player_0[0]) === 8))){
                    console.log('Special condition found! so, occupied corner by bot')
                    if((Math.abs(this.state.player_x[1] - this.state.player_0[0]) === 4))
                        randomIndex = [0, 8][Math.floor(Math.random() * [0, 8].length)]

                    if((Math.abs(this.state.player_x[1] - this.state.player_0[0]) === 8))
                        randomIndex = [2, 6][Math.floor(Math.random() * [2, 6].length)]
                }
                // 1.5 Random Move
                else{
                    console.log('Random move')
                    randomIndex = filter_index[Math.floor(Math.random() * filter_index.length)];
                }
            }
            else if([0, 2, 6, 8].includes(this.state.player_x[0])){ // 2. Check if game starts with corner conditions
                // 2.1 Occupy middle box
                if(this.state.history.length-1 === 1){
                    console.log('Started with Corner box')
                    console.log('Middle box occupied by bot')
                    randomIndex = 4
                }

                // 2.2 check if bot can win
                else if(this.checkPlayerWin(winning_positions, this.state.player_0) === 0 || this.checkPlayerWin(winning_positions, this.state.player_0)){
                    console.log('Bot can win')
                    randomIndex = this.checkPlayerWin(winning_positions, this.state.player_0)
                }

                // 2.3 check if opponent could win
                else if (this.checkPlayerWin(winning_positions, this.state.player_x) === 0 || this.checkPlayerWin(winning_positions, this.state.player_x)){
                    console.log('Opponent can win')
                    randomIndex = this.checkPlayerWin(winning_positions, this.state.player_x)
                }
                
                // 2.4 check if player occupies two corners in two moves.
                else if (this.state.player_x.length === 2 && ((Math.abs(this.state.player_x[1] - this.state.player_x[0]) === 4) || (Math.abs(this.state.player_x[1] - this.state.player_x[0]) === 8))){
                    console.log('Special condition found! so, occupied corner by bot')
                    randomIndex = [1, 3, 5, 7][Math.floor(Math.random() * [1, 3, 5, 7].length)]
                }
                // 2.5 Random Move
                else{
                    console.log('Random move')
                    randomIndex = filter_index[Math.floor(Math.random() * filter_index.length)];
                }
            }
            else if([1, 3, 5, 7].includes(this.state.player_x[0])){ // 3. game start with side condition
                // 3.1 Bot first move
                if(this.state.history.length-1 === 1){
                    console.log('bot first move')
                    winning_positions.forEach(element => {
                        if(element[1] === this.state.player_x[0]){
                            randomIndex = element[0];
                        }
                    })
                }
                // 3.2 Bot second move
                else if(this.state.player_x.length == 2 && this.state.player_x[1] !== 4){
                    console.log('bot occupy middle box in second move');
                    randomIndex = 4;
                }
                // 3.3 check if bot can win
                else if(this.checkPlayerWin(winning_positions, this.state.player_0) === 0 || this.checkPlayerWin(winning_positions, this.state.player_0)){
                    console.log('Bot can win')
                    randomIndex = this.checkPlayerWin(winning_positions, this.state.player_0)
                }

                // 3.4 check if opponent could win
                else if (this.checkPlayerWin(winning_positions, this.state.player_x) === 0 || this.checkPlayerWin(winning_positions, this.state.player_x)){
                    console.log('Opponent can win')
                    randomIndex = this.checkPlayerWin(winning_positions, this.state.player_x)
                }
                // 3.5 Random Move
                else{
                    console.log('Random move')
                    randomIndex = filter_index[Math.floor(Math.random() * filter_index.length)];
                }
            }
        }

        return randomIndex
    }

    handleHistory(index) {
        if(index === 0){
            this.setState({
                player_0: [],
                player_x: []
            })
        }
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

    handleGoToButtons(index){
        if(this.state.play_with_bot){
            return true;
        }
        return false;
    }

    render() {
        const winner = this.calculateWinner(this.state.history[this.state.history.length - 1].squares.slice());
        let status;
        if (winner) {
            status = 'winner is ' + winner;
        }
        else if (this.state.history.length >= 10) {
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
                disabled={this.handleGoToButtons(index)}
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

