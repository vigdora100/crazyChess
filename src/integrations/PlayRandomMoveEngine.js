import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import Chess from 'chess.js';
import { MapWeaponCardsToClass } from '../BonusCards/MapWeaponCardsToClass'
import { connect } from 'react-redux'
import { forEach } from 'lodash'

import Chessboard from '../Chessboard';


class HumanVsRandomBase extends Component {
    static propTypes = {children: PropTypes.func};


      onmessage = (event) => {
        let message = event.data ? event.data : event;
        if(message.startsWith("bestmove")) {
            let move = message.split(" ")[1];
            this.game.move(move, { sloppy: true });

            console.log('2:', this.game.fen())

            this.setState({
                fen: this.game.fen(),
                squareStyles: {
                    [this.game.history({verbose: true})[this.game.history().length - 1]
                        .to]: {
                        backgroundColor: 'DarkTurquoise'
                    }
                }
            });
        }
    };

    state = {fen: 'start', squareStyles: {}, pieceSquare: ''};

    componentDidMount() {

        this.game = new Chess();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('snapshot: ', snapshot)
    }


    makeRandomMove = () => {
        let possibleMoves = this.game.moves();

        // exit if the game is over
        if (
            this.game.game_over() === true ||
            this.game.in_draw() === true ||
            possibleMoves.length === 0
        )
            return;

        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        console.log('1:', this.game.fen())
        console.log("possibleMoves: ", possibleMoves)
        stockfishGlobal.postMessage("position fen " + this.game.fen());
        stockfishGlobal.postMessage("go depth 1");
        let that = this;
        stockfishGlobal.onmessage = this.onmessage

    };

    onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal
        var move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        this.setState({fen: this.game.fen()});

        window.setTimeout(this.makeRandomMove, 1000);
    };

    onSquareClick = square => {
        const {currentWeapon} =  this.props

        this.setState({
            squareStyles: {[square]: {backgroundColor: 'DarkTurquoise'}},
            pieceSquare: square
        });

        if(currentWeapon){
            MapWeaponCardsToClass[currentWeapon.name].onUseWeapon(this,square,currentWeapon)
        }else {
            let move = this.game.move({
                from: this.state.pieceSquare,
                to: square,
                promotion: 'q' // always promote to a queen for example simplicity
            });


            // illegal move
            if (move === null) return;
            this.setState({fen: this.game.fen()});
            window.setTimeout(this.makeRandomMove, 1000);
        }
    };

    render() {
        const {fen, squareStyles} = this.state;
        const {weaponCollection} =  this.props;
        let WeaponComponents = []
        forEach(weaponCollection, (weapon)=> {
            MapWeaponCardsToClass[weapon] &&WeaponComponents.push(MapWeaponCardsToClass[weapon]);
        })
        return(
        <div>
            {WeaponComponents.map(WeaponComponent=>{return <WeaponComponent/>})}
            {this.props.children({
            position: fen,
            onDrop: this.onDrop,
            onSquareClick: this.onSquareClick,
            squareStyles
        })}
        </div>)
    }
}

let mapStateToProps = (state) => {
    return {
        currentWeapon: state.currentWeapon,
        weaponCollection: state.weaponCollection
    }
}

const HumanVsRandom = connect(mapStateToProps,null)(HumanVsRandomBase)

export default function PlayRandomMoveEngine() {
    return (
        <div>
            <HumanVsRandom>
                {({position, onDrop, onSquareClick, squareStyles}) => (
                    <Chessboard
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
        </div>
    );
}
