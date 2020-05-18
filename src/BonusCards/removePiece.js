import React, { useState } from 'React'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { removeWeapon } from './actions'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';
import { get, isEqual } from 'lodash';


const BonusCard = styled.button`
    width:100px;
    height: 50px;
`

const PieceButton = styled.button`
`

const PiecesWrapper = styled.div`
      border-color: red

`

class addPiece extends React.Component {
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
        const { game, square, color,
            options: { pieceType: pieceType }, changeTurn } = this.props
        let isTherePiece = game.get(square)
        if (game.turn() === color) { 
            if (isTherePiece && isTherePiece.type == pieceType && isTherePiece.color != color ) {
                game.remove(square)
                this.currentWeaponSquare = square;
                this.setState({ weaponFired: true })
                let lastMove = { to: square, type: pieceType, moveType: 'weapon', color:color }
                changeTurn('REMOVE_PIECE',lastMove, color)
            }
        }
    }

    addPiece = (square) => {
        const {color, options: { pieceType: pieceType }, game, updateBoardFen, playerWeaponsCollection, playerNumber } = this.props
        console.log('adding piece back')
        let opponentColor = color == 'w' ? 'b' : 'w';
        let opponentPlayerNumber = playerNumber == 'p1' ? 'p2' : 'p1';
        let piece = { type: pieceType, color: opponentColor }
        let isTherePiece = game.get(square)
        let lastMove = { from: square, moveType: 'remove-weapon', color:color }
        if(!isTherePiece){
            game.put(piece,square)
            game.load(game.fen())
            updateBoardFen(game.fen())
        }else{
            playerWeaponsCollection.push({})
            let weaponToAdd = {weaponType: 'ADD_PIECE', options: {pieceType: opponentColor}};
            this.props.modifyWeaponsCollection('REMOVE_PIECE',weaponToAdd, lastMove, game.fen(),opponentPlayerNumber, 'ADD' )
        }
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
                if (turns > 0) {
                    this.setState(({ turns }) => ({ turns: turns - 1 }))
                }
                
                if (!weaponRemoved && turns == 0) {
                    this.addPiece(this.currentWeaponSquare) //TODO: add weapon or piece
                    this.setState({ weaponRemoved: true });
                }
            }
        }
    }

    render() {
        const { options: { pieceType }, color } = this.props
        const { turns, weaponFired, weaponRemoved } = this.state

        let typeAndColorPiece = color + pieceType.toUpperCase();
        return ( //TODO: make it show it is remove weapon
            !weaponRemoved ? <BonusCard onClick={this.clickOnWeapon} disabled={weaponFired}>
                {defaultPieces[typeAndColorPiece]}
                <div>{turns}</div>
                <div> remove </div>
            </BonusCard> : null
        )
    }
}


const mapDispatchToProps = {

    removeWeapon: removeWeapon
}


export default connect(null, mapDispatchToProps)(addPiece)