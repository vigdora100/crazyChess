import React, { useState } from 'React'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { removeWeapon } from './actions'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';
import { get, isEqual } from 'lodash';
import downgradeSign from '../Chessboard/svg/weapons/downgrade.svg';

const BonusCard = styled.button`
    display: flex;
    width:100px;
    height: 50px;
    align-items: center;
    justify-content: center
`

const PieceButton = styled.button`
`

const PiecesWrapper = styled.div`
      border-color: red

`
const downGradingMap = {
    'b' : 'p',
    'n': 'p',
    'r': Math.random() > 0.5 ? 'n' : 'b',
    'q': 'r',
    'k': 'k'
}

class downGradePiece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weaponDeployed: false,
            turns: props.turns,
            piece: props.piece,
            weaponFired: false,
            weaponRemoved: false
        }
        this.currentWeaponSquare = ''
    }


    onUseWeapon = () => {
        const { game, square, color, changeTurn } = this.props
        let pieceInSquare = game.get(square)
        if (game.turn() === color) { 
            if (pieceInSquare && pieceInSquare.color != color ) {
                let newPiece = { type : downGradingMap[pieceInSquare.type] , color: pieceInSquare.color } 
                game.put(newPiece, square)
                this.currentWeaponSquare = square;
                this.originalPieceInSquare = pieceInSquare
                this.setState({ weaponFired: true })
                let lastMove = { to: square, moveType: 'weapon', color:color }
                changeTurn('DOWNGRADE_PIECE',lastMove, color)
            }
        }
    }

    upgradePiece = (square) => {
        const {color, game, updateBoardFen, playerNumber } = this.props
        let lastMove = { from: square, moveType: 'remove-weapon', color:color }
        game.put(this.originalPieceInSquare,square)
        game.load(game.fen())
        updateBoardFen(game.fen())
        this.props.modifyWeaponsCollection('DOWNGRADE_PIECE',{}, lastMove, game.fen(),playerNumber, 'REMOVE' )
        
    }


    clickOnWeapon = (piece) => {
        const { clearSqaureClicked } = this.props
        this.setState({ weaponDeployed: true })
        clearSqaureClicked();   // need to clear to prevent collision with square clicking for moving pieces
    }

    componentDidUpdate(prevProps) {
        const { weaponDeployed, weaponRemoved, weaponFired } = this.state
        const { lastMove, square } = this.props
        if (weaponDeployed) {
            if (!weaponRemoved && !weaponFired) {
                if (square && square !== prevProps.square) {
                    this.onUseWeapon()
                }
            }
            //weapon deployed and some move was played
            if (lastMove && !isEqual(lastMove, prevProps.lastMove)) {
                const { turns } = this.state
                if (lastMove.from === this.currentWeaponSquare) { //the weapon moved
                    this.currentWeaponSquare = lastMove.to;
                }
                if (turns > 0) {
                    this.setState(({ turns }) => ({ turns: turns - 1 }))
                }
                 //if piece was taken by myself
                if (this.props.color == lastMove.color && lastMove.to == this.currentWeaponSquare && lastMove.moveType != 'weapon') {
                    this.setState({ weaponRemoved: true });
                }
                else if (!weaponRemoved && turns == 0) {
                    this.upgradePiece(this.currentWeaponSquare) //TODO: add weapon or piece
                    this.setState({ weaponRemoved: true });
                }
            }
        }
    }

    render() {
        const { color } = this.props
        const { turns, weaponFired, weaponRemoved } = this.state

        return ( //TODO: make it show it is remove weapon
            !weaponRemoved ? <BonusCard onClick={this.clickOnWeapon} disabled={weaponFired}>
                <img src={`/${downgradeSign}`}></img>
                <div>{turns}</div>
            </BonusCard> : null
        )
    }
}


const mapDispatchToProps = {

    removeWeapon: removeWeapon
}


export default connect(null, mapDispatchToProps)(downGradePiece)