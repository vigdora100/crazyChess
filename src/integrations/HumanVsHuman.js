import React, {Component, Fragment} from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import Chess from 'chess.js';
import {MapWeaponCardsToClass} from '../BonusCards/MapWeaponCardsToClass'
import {connect} from 'react-redux'
import Arsenal from '../components/arsenal'
import InfoBoard from '../components/infoBoard'
import styled from 'styled-components'
import {get, findIndex, filter, cloneDeep, forEach} from 'lodash'
import {withRouter} from 'react-router'
import swal from 'sweetalert';



const GameWrapper = styled.div`
    display:flex;
    align-items: center;
`
//const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const STARTING_FEN = "rnbqkbnr/1ppppppp/8/8/p1B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4"
const {firebase} = window;


import Chessboard from '../Chessboard';
import Utils from "../Chessboard/utils";
import HumanVsHuman from "../Home";

class HumanVsRandomBase extends Component {
    static propTypes = {children: PropTypes.func};

    constructor(props) {
        super();
        this.state = {
            fen: 'start',
            squareStyles: {},
            dataBaseId: '',
            gameInDB: '',
            playerColor: '',
            shouldShowInfo: '',
            squareClicked: '',
            lastMove:'',
            weaponUsage: {weaponType: '', weaponStatus: '', options: '' },
            weaponsOnBoard: {}, 
        };
        this.gameEngine = new Chess();
    }

    async componentDidMount() {
        let token = get(this, 'props.match.params.token')
        const {weaponCollection} = this.props
        if(!token){ //user created new game
            const newGameSetUp = {
                p1_token: Utils.token(),
                p2_token: Utils.token(),
                fen: STARTING_FEN,
                p1: {
                    weapons: weaponCollection
                },
                gameStatus: 'Playable',
                moveNumber: 1
            };
            const DB = firebase.database().ref("games").push();
            await DB.set(newGameSetUp)
            token = newGameSetUp.p1_token;
            this.updateInfo(newGameSetUp.p2_token)
        }
            listenForUpdates(token,weaponCollection,  (id, game) => {
                this.gameEngine.load(game.fen)
                const playerColor = figurePlayer(token, game); //TODO: chose player color randomely
                let playerNumber = playerColor =='w' ? 'p1' : 'p2'
                const lastMove = get(game, 'lastMove')
                this.setState({
                        gameInDB: game,
                        playerColor: playerColor,
                        fen: game.fen,
                        dataBaseId: id,
                        lastMove:lastMove,
                        playerNumber:playerNumber,
                        gameStatus : get(game, 'gameStatus'),
                        weaponsOnBoard: get(game, 'weaponsOnBoard'),
                        moveNumber: get(game, 'moveNumber')
                        })
            });
    }


    clickOnWeapon = (weaponType, options) => {
        let weaponObject = { weaponType: weaponType, weaponStatus: 'deployed', options: options }
        this.setState({weaponUsage: weaponObject})
    }

    onWeaponFired = () =>{
        let weaponObject = { weaponType: '', weaponStatus: '', options: '' }
        this.setState({weaponUsage: weaponObject})
    }

    changeTurn = (weaponType, lastMove, CurrentPlayerColor) => {
        const { playerNumber }  = this.props
        let tokens = this.gameEngine.fen().split(' ');
        tokens[1] = CurrentPlayerColor =='w' ? 'b' : 'w'
        tokens[3] = '-'
        let newFen = tokens.join(' ')
        let loadResult = this.gameEngine.load(newFen);
            this.setState({fen: newFen})
            let playerWeapons = this.getPlayerWeapons();
            playerWeapons.forEach((weapon)=>{
                if (weapon.weaponType == weaponType){
                    weapon.deployed = true;
                } 
            })
            this.modifyWeaponsCollection(weaponType,playerWeapons, lastMove, newFen, playerNumber,'REPLACE' )
    }

    EngineChangeTurn = (targetPlayerColor) => { 
        let tokens = this.gameEngine.fen().split(' ');
        tokens[1] = targetPlayerColor;
        let newFen = tokens.join(' ')
        this.gameEngine.load(newFen);
        return newFen
    }

    isCheckMate = () => {
        return this.gameEngine.game_over() === true 
    }

    modifyWeaponsCollection = (weaponType, WeaponsNewObj, lastMove, newFen, playerNumber, actionType) =>{
        const { dataBaseId } = this.state
        let playerWeapons = this.getPlayerWeapons();

        switch(actionType){
            case 'REMOVE' : {
            let index = findIndex(playerWeapons, (weapon)=>{return weapon.weaponType == weaponType })
            playerWeapons.splice(index, 1)
            break;
            }
            case 'ADD' : {
                playerWeapons.push(WeaponsNewObj)
                break;
            }
            case 'REPLACE' : {  
                playerWeapons = WeaponsNewObj;
                break;
            }
            case 'UPDATE' : {
                break;  
            }
        }
        let game = {fen: newFen, lastMove: lastMove, [playerNumber]: { weapons: playerWeapons}}
        games(dataBaseId).update(game)
    }
    
    

    onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal
        const { weaponUsage, weaponsOnBoard }  = this.state
        console.log('fen here: ' ,this.gameEngine.fen())
        if(get(weaponUsage, 'weaponStatus') != 'deployed'){
        const {dataBaseId, playerColor, playerNumber, gameInDB} = this.state
        let move = (this.gameEngine.turn() === playerColor) && this.gameEngine.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        });
        
        // illegal move
        if (move === null) return;

        //update weapnse on Board
        let weaponsOnBoardCopy;
        if(weaponsOnBoard){
            weaponsOnBoardCopy = cloneDeep(weaponsOnBoard)
            if(weaponsOnBoard.hasOwnProperty(sourceSquare)){
                weaponsOnBoardCopy[targetSquare] = weaponsOnBoardCopy[sourceSquare]
                delete weaponsOnBoardCopy[sourceSquare]
                weaponsOnBoardCopy[targetSquare].duration = weaponsOnBoardCopy[targetSquare].duration-1
            }
            for (const [square, weapon] of Object.entries(weaponsOnBoardCopy)) {
                if (weapon.duration == 0){
                delete weaponsOnBoardCopy[square]
                this.gameEngine.remove(square)
                this.gameEngine.load(this.gameEngine.fen())
                }
            }
            if(weaponsOnBoard.hasOwnProperty(targetSquare)){
                delete weaponsOnBoardCopy[targetSquare]
                this.setState({weaponsOnBoard: weaponsOnBoardCopy})
            }
            this.setState({weaponsOnBoard: weaponsOnBoardCopy})
        }
        console.log('fen in drop:', this.gameEngine.fen())
        let game = {fen: this.gameEngine.fen(), lastMove:move }
        this.setState({fen: this.gameEngine.fen(), lastMove: move});
        if(weaponsOnBoardCopy){  game.weaponsOnBoard = weaponsOnBoardCopy;}
        if (this.gameEngine.game_over() === true ||this.gameEngine.in_draw() === true ) {
            let oponentNumber = playerNumber == 'p1' ? 'p2' : 'p1'
            game.gameStatus =  {'gameOver': oponentNumber}
            swal("congratulation", "you won the game!", "success")
        }
        game.moveNumber = gameInDB.moveNumber+1
        console.log('turn: ', game.moveNumber)        
        games(dataBaseId).update(game)
        }
    };

    onSquareClick = square => {
        const {playerColor, gameInDB, dataBaseId, weaponUsage} = this.state;

        if(get(weaponUsage, 'weaponStatus') != 'deployed'){
        this.setState({
            squareStyles: {[square]: {backgroundColor: 'DarkTurquoise'}},
            squareClicked: square
        });

        let move = (this.gameEngine.turn() === playerColor) && this.gameEngine.move({
            from: this.state.squareClicked,
            to: square,
            promotion: 'q' // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;
        this.setState({fen: this.gameEngine.fen(), lastMove: move});
        let game = {fen: this.gameEngine.fen(), lastMove: move}
        games(dataBaseId).update(game);
        }else{
            //weapon act
            const { pieceType, weaponType } = weaponUsage.options
            let pieceCode = playerColor + pieceType.toUpperCase();
            let game = {weaponsOnBoard: {[square]: {color: playerColor, ...weaponUsage.options, pieceCode: pieceCode, isWeapon: true }}}
            let piece = { type: pieceType, color: playerColor }
            this.gameEngine.put(piece, square)
            let lastMove = { to: square, type: pieceType, moveType: 'weapon', color:playerColor }
            this.changeTurn(weaponType, lastMove, playerColor);
            game.moveNumber = gameInDB.moveNumber+1
            console.log('turn: ', game.moveNumber)
            this.onWeaponFired()
            games(dataBaseId).update(game);
        }
    }


    updateBoardFEN = (FEN) => {
        this.setState({fen: FEN})
    }

    updateInfo = (token) => {
        this.setState({shouldShowInfo: token})
    }

    clearSqaureClicked = () => {
            this.setState({squareClicked: ''})

    }

    getPlayerWeapons = () => {
        const { gameInDB, playerNumber } = this.state;
        return playerNumber == 'p1' ? get(gameInDB, 'p1.weapons') : get(gameInDB, 'p2.weapons')
    }


 
    render() {
        const {fen, squareStyles, playerColor, shouldShowInfo, squareClicked, lastMove, gameStatus, playerNumber, gameInDB,weaponsOnBoard} = this.state;
        const weapons = this.getPlayerWeapons()
        const turn = this.gameEngine.turn();
        const gameOverMsg = (gameStatus && gameStatus['gameOver'] == playerNumber && gameStatus ) ?   'gameOver' : 'keepPlaying'
        gameOverMsg == 'gameOver' && swal("too bad", "you lost the game!", "warning")
        console.log('gameInDB:', gameInDB)
        console.log('fen:', fen)
        return (
            <Fragment>
                <Arsenal>
                    {weapons && weapons.map((weaponObj, index) => {
                        let WeaponComponent = MapWeaponCardsToClass[weaponObj.weaponType]
                        return <WeaponComponent square={squareClicked}
                                                game={this.gameEngine} 
                                                color={playerColor}
                                                updateBoardFen={this.updateBoardFEN} 
                                                key={index} 
                                                options={weaponObj.options}
                                                turn={turn} 
                                                lastMove={lastMove} 
                                                turns={3}
                                                clickOnWeapon={this.clickOnWeapon}
                                                playerNumber={playerNumber}
                                                clearSqaureClicked={this.clearSqaureClicked}
                                                changeTurn = {this.changeTurn}
                                                modifyWeaponsCollection = { this.modifyWeaponsCollection}
                                                playerWeaponsCollection = { weapons }
                                                />
                    })}
                </Arsenal>
                {this.props.children({
                    orientation: playerColor === 'w' ? "white" : "black",
                    position: fen,
                    onDrop: this.onDrop,
                    onSquareClick: this.onSquareClick,
                    squareStyles,
                    weaponsOnBoard: weaponsOnBoard
                })}
                 <InfoBoard>
                    <div> {shouldShowInfo} </div>
                    <div> {gameOverMsg } </div>
                    <div> it is {turn} turn </div>
                </InfoBoard>
            </Fragment>)
    }
}

let mapStateToProps = (state) => {
    return {
        weaponCollection: state.weaponCollection
    }
}


const listenForUpdates = (token,weaponCollection, cb) => {
    const db = firebase.database().ref("/games");
    ["p1_token", "p2_token"].forEach((name) => {
        const ref = db.orderByChild(name).equalTo(token);
        ref.on('value', (ref) => {
            const [id, game] = parse(ref.val());
            //push weapons for second player TODO: make it beter
            if(name === "p2_token" && game && game.p2 == null){
                game.p2 = {weapons: weaponCollection};
                games(id).set(game)
            }
            if (!id) return;
            cb(id, game);
        });
    });
}

function games(id) {
    return firebase
        .database()
        .ref(`/games/${id}`);
}


function figurePlayer(token, {p1_token, p2_token}) {
    if (token === p1_token) {
        return 'w';
    } else if (token === p2_token) {
        return 'b';
    } else {
        return 0;
    }
}

const parse = (tree) => {
    if (!tree) return [];
    const keys = Object.keys(tree);
    const id = keys[0];
    const game = tree[id];
    return [id, game];
}

const HumanVsRandom = connect(mapStateToProps, null)(withRouter(HumanVsRandomBase))

export default function PlayRandomMoveEngine(props) {
    return (
        <GameWrapper>
            <HumanVsRandom>
                {({position, onDrop, onSquareClick, squareStyles, orientation, weaponsOnBoard}) => (
                    <Chessboard
                        orientation={orientation}
                        calcWidth={({screenWidth}) => (screenWidth < 500 ? 350 : 480)}
                        id="humanVsRandom"
                        position={position}
                        onDrop={onDrop}
                        boardStyle={{
                            borderRadius: '5px',
                            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                        }}
                        onSquareClick={onSquareClick}
                        squareStyles={squareStyles}
                        weaponsOnBoard={weaponsOnBoard}
                    />
                )}
            </HumanVsRandom>
        </GameWrapper>
    );
}
