import React, {Component, Fragment} from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import Chess from 'chess.js';
import {MapWeaponCardsToClass} from '../BonusCards/MapWeaponCardsToClass'
import {connect} from 'react-redux'
import {forEach} from 'lodash'
import Arsenal from '../components/arsenal'
import styled from 'styled-components'
import {get} from 'lodash'
import {withRouter} from 'react-router'


const GameWrapper = styled.div`
    display:flex;
    align-items: center;
`
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
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
            pieceSquare: '',
            dataBaseId: '',
            gameInDB: '',
            playerColor: '',
            shouldShowInfo: '',
            squareClicked: '',
            lastMove:''
        };
        this.game = new Chess();
    }

    async componentDidMount() {
        let token = get(this, 'props.match.params.token')
        const newGame = {
            p1_token: Utils.token(),
            p2_token: Utils.token(),
            fen: STARTING_FEN
        };
        const game = firebase.database().ref("games").push();
        await game.set(newGame)
        this.updateInfo(newGame.p2_token)
        token = token || newGame.p1_token;
        listenForUpdates(token, (id, game) => {
            this.setState({dataBaseId: id})
            this.game.load(game.fen)
            this.updateBoard(id, game, token)
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal

        const {dataBaseId, gameInDB, playerColor} = this.state
        var move = (this.game.turn() === playerColor) && this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        this.setState({fen: this.game.fen(), lastMove: move});
        let game = {fen: this.game.fen(), p1_token: gameInDB.p1_token, p2_token: gameInDB.p2_token}
        games(dataBaseId).set(game)
    };

    updateBoard = (id, game, token) => {
        const playerColor = figurePlayer(token, game);
        game.fen && this.setState({fen: game.fen});
        this.setState({gameInDB: game, playerColor: playerColor})
    }

    updateBoardFEN = (FEN) => {
        this.setState({fen: FEN})
    }

    updateInfo = (token) => {
        this.setState({shouldShowInfo: token})
    }


    onSquareClick = square => {
        const {currentWeapon} = this.props;
        const {playerColor} = this.state;
        this.setState({squareClicked: square})

        this.setState({
            squareStyles: {[square]: {backgroundColor: 'DarkTurquoise'}},
            pieceSquare: square
        });

        if (currentWeapon) {
            //do nothing, square click is weapon related
        } else {
            let move = (this.game.turn() === playerColor) && this.game.move({
                from: this.state.pieceSquare,
                to: square,
                promotion: 'q' // always promote to a queen for example simplicity
            });


            // illegal move
            if (move === null) return;
            this.setState({fen: this.game.fen()});
            //window.setTimeout(this.makeRandomMove, 1000); //TODO: apply the click option
        }
    };

    render() {
        const {fen, squareStyles, playerColor, shouldShowInfo, squareClicked, lastMove} = this.state;
        const {weaponCollection} = this.props;
        let WeaponComponents = []
        /* forEach(weaponCollection, (weaponObj) => {
            MapWeaponCardsToClass[weaponObj.weaponType] && WeaponComponents.push(MapWeaponCardsToClass[weapon]);
        }) */
        console.log('orientation:', playerColor)
        return (
            <Fragment>
                <Arsenal>
                    {weaponCollection.map((weaponObj, index) => {
                        let WeaponComponent = MapWeaponCardsToClass[weaponObj.weaponType]
                        return <WeaponComponent square={squareClicked} game={this.game} color={playerColor}
                                                updateBoardFen={this.updateBoardFEN} key={index} options={weaponObj.options}
                                                turn={this.game.turn()} lastMove={lastMove} turns={3}/>
                    })}
                </Arsenal>
                {this.props.children({
                    orientation: playerColor === 'w' ? "white" : "black",
                    position: fen,
                    onDrop: this.onDrop,
                    onSquareClick: this.onSquareClick,
                    squareStyles
                })}
                 <Arsenal>
                    <div> {shouldShowInfo} </div>
                    <div> it is {this.game.turn()} turn </div>
                </Arsenal>
            </Fragment>)
    }
}

let mapStateToProps = (state) => {
    return {
        currentWeapon: state.currentWeapon,
        weaponCollection: state.weaponCollection
    }
}


const HumanVsHumanInit = () => {
    const newGame = {
        p1_token: Utils.token(),
        p2_token: Utils.token()
    };

    const game = firebase.database().ref("games").push();

    game.set(newGame)
        .then(() => {
            return <HumanVsHuman token={newGame.p1_token}/>
        }, (err) => {
            throw err;
        });

}


const listenForUpdates = (token, cb) => {
    const db = firebase.database().ref("/games");
    ["p1_token", "p2_token"].forEach((name) => {
        const ref = db.orderByChild(name).equalTo(token);
        ref.on('value', (ref) => {
            const [id, game] = parse(ref.val());
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
                {({position, onDrop, onSquareClick, squareStyles, orientation}) => (
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
                    />
                )}
            </HumanVsRandom>
        </GameWrapper>
    );
}
