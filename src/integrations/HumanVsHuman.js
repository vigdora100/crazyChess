import React, {Component, Fragment} from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import Chess from 'chess.js';
import {MapWeaponCardsToClass} from '../weapons/MapWeaponCardsToClass'
import {connect} from 'react-redux'
import Arsenal from '../components/arsenal'
import InfoBoard from '../components/infoBoard'
import styled from 'styled-components'
import {get, isEmpty, cloneDeep} from 'lodash'
import {withRouter} from 'react-router'
import swal from 'sweetalert';
import weaponsLogic  from '../weapons/weaponsLogic'
import cancelWeapon from '../Chessboard/svg/general/cancel.svg';
import weaponPieces from '../weapons/weaponsPieces'

const DisableWeapon = styled.button`
    position: absolute;
    top: 3px;
    right:3px;
    width: 40px;
    height: 40px;
    background-image: url(/${cancelWeapon});
`;

const GameWrapper = styled.div`
    display:flex;
    align-items: center;
`
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
//const STARTING_FEN = "rnbqkbnr/1ppppppp/8/8/p1B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4"
const {firebase} = window;


import Chessboard from '../Chessboard';
import Utils from "../Chessboard/utils";

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
                moveNumber: 1,
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
                        weaponsOnBoard: get(game, 'weaponsOnBoard') || {},
                        moveNumber: get(game, 'moveNumber')
                        })
            });
    }


    clickOnWeapon = (weaponType, options, index) => {
        let weaponObject = { weaponType: weaponType, weaponStatus: 'deployed', options: options, index: index }
        this.setState({weaponUsage: weaponObject})
    }

    clearWeaponUsage = () =>{
        let weaponObject = { weaponType: '', weaponStatus: '', options: '' }
        this.setState({weaponUsage: weaponObject})
    }

    changeTurn = (CurrentPlayerColor) => {
        let tokens = this.gameEngine.fen().split(' ');
        tokens[1] = CurrentPlayerColor =='w' ? 'b' : 'w'
        //the change he is due to a bug related en passant when changing turns.. 
        tokens[3] = '-'
        let newFen = tokens.join(' ')
        this.gameEngine.load(newFen)
        return newFen
    }

    onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal
        const { weaponUsage, weaponsOnBoard }  = this.state
        if(get(weaponUsage, 'weaponStatus') != 'deployed'){
        const {dataBaseId, playerColor, playerNumber, gameInDB} = this.state
        let move = (this.gameEngine.turn() === playerColor) && this.gameEngine.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        });
        
        // illegal move
        if (move === null || move === false ) return;

        //update weapnse on Board
        let weaponsOnBoardCopy;
        if(!isEmpty(weaponsOnBoard)){
            weaponsOnBoardCopy = cloneDeep(weaponsOnBoard)
          //if weapon was taken by another weapon or piece
            if(weaponsOnBoard.hasOwnProperty(targetSquare)){
                delete weaponsOnBoardCopy[targetSquare]
            } 
            //weapon movement
            if(weaponsOnBoardCopy.hasOwnProperty(sourceSquare)){
                weaponsLogic[weaponsOnBoardCopy[sourceSquare].weaponType].movementLogic(weaponsOnBoardCopy, targetSquare, sourceSquare, this.gameEngine)               
            }
            //apply when duration end logic on each weapon
            for (const [square, weapon] of Object.entries(weaponsOnBoardCopy)) {
                weaponsLogic[weapon.weaponType].durationLogic(weaponsOnBoardCopy,square)
                if (weapon.duration == 0){
                    weaponsLogic[weapon.weaponType].weaponRemoved({weaponsOnBoardCopy, gameEngine: this.gameEngine, square, weapon, 
                        playerNumber,playerColor})         
                }
            }
        }
        let game = {fen: this.gameEngine.fen(), lastMove:move }
        this.setState({fen: this.gameEngine.fen(), lastMove: move, weaponsOnBoard: weaponsOnBoardCopy? weaponsOnBoardCopy : weaponsOnBoard });
        if(weaponsOnBoardCopy){  game.weaponsOnBoard = weaponsOnBoardCopy;}
        game.gameStatus = this.checkIfGameOver(this.gameEngine, playerNumber)
        game.moveNumber = gameInDB.moveNumber+1
        games(dataBaseId).update(game)
        }
    };

    onSquareClick = square => {
        const {playerColor, gameInDB, dataBaseId, weaponUsage, weaponsOnBoard,playerNumber} = this.state;
        const { weaponType, weaponStatus, index} = weaponUsage
        if(weaponStatus != 'deployed'){
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
        }else if(weaponsLogic[weaponType].validate({gameEngine: this.gameEngine, square, playerColor, weaponUsage, weaponsOnBoard})){
            let updatedGame = {}
            const {lastMove, weaponObj } = weaponsLogic[weaponType].weaponFire({weaponUsage, playerColor,playerNumber, square,
                gameEngine: this.gameEngine, gameInDB})
            updatedGame.weaponsOnBoard = Object.assign(weaponsOnBoard, weaponObj);
            updatedGame.fen = this.changeTurn(playerColor);
            updatedGame[playerNumber] = { weapons: this.removeWeapon(index) }
            updatedGame.lastMove = lastMove;
            //to check if game over need to happen after changing turn
            updatedGame.gameStatus = this.checkIfGameOver(this.gameEngine, playerNumber)
            updatedGame.moveNumber = gameInDB.moveNumber+1
            games(dataBaseId).update(updatedGame);
            this.clearWeaponUsage()
        }
    }

    removeWeapon = (index) => {
        let playerWeapons = this.getPlayerWeapons();
        playerWeapons.splice(index, 1)
        return playerWeapons
    }

    addWeapon = (WeaponsNewObj) => {
        let playerWeapons = this.getPlayerWeapons();
        playerWeapons.push(WeaponsNewObj)
        return playerWeapons
    }

    checkIfGameOver = (gameEngine,playerNumber) =>{
        if (gameEngine.game_over() === true ||gameEngine.in_draw() === true ) {
            let oponentNumber = playerNumber == 'p1' ? 'p2' : 'p1'
            swal("congratulation", "you won the game!", "success")
            return  {'gameOver': oponentNumber}
        }
        return 'playbale'
    }

    updateInfo = (token) => {
        this.setState({shouldShowInfo: token})
    }

    getPlayerWeapons = () => {
        const { gameInDB, playerNumber } = this.state;
        return playerNumber == 'p1' ? get(gameInDB, 'p1.weapons') : get(gameInDB, 'p2.weapons')
    }

    render() {
        const {fen, squareStyles, playerColor, shouldShowInfo, gameStatus, playerNumber, weaponUsage,weaponsOnBoard} = this.state;
        const weapons = this.getPlayerWeapons()
        const turn = this.gameEngine.turn();
        const gameOverMsg = (gameStatus && gameStatus['gameOver'] == playerNumber && gameStatus ) ?   'gameOver' : 'keepPlaying'
        gameOverMsg == 'gameOver' && swal("too bad", "you lost the game!", "warning")
        return (
            <Fragment>
                <Arsenal>
                    {weaponUsage.weaponType ? <DisableWeapon onClick={this.clearWeaponUsage}></DisableWeapon>: <div></div>}
                    {weapons && weapons.map((weaponObj, index) => {
                        let buttonClicked = weaponUsage.index == index
                        let WeaponComponent = MapWeaponCardsToClass[weaponObj.weaponType]
                        return <WeaponComponent 
                                                color={playerColor}
                                                key={index} 
                                                index={index}
                                                options={weaponObj.options}
                                                buttonClicked={buttonClicked}
                                                clickOnWeapon={this.clickOnWeapon}
                                                />
                    })}
                </Arsenal>
                {this.props.children({
                    orientation: playerColor === 'w' ? "white" : "black",
                    position: fen,
                    onDrop: this.onDrop,
                    onSquareClick: this.onSquareClick,
                    squareStyles,
                    weaponsOnBoard: cloneDeep(weaponsOnBoard)
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
                        pieces={
                            weaponPieces
                        }
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
