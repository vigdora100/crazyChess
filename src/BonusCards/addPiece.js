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
      border-color: black

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
        const { game, square, color, updateBoardFen,
            options: { pieceType: pieceType }, changeTurn } = this.props
        let isTherePiece = game.get(square)
        if (game.turn() === color) { //TODO: validate user turn
            if (!isTherePiece) {
                let piece = { type: pieceType, color: color }
                game.put(piece, square)
                this.currentWeaponSquare = square;
                this.setState({ weaponFired: true })
                let lastMove = { to: square, type: pieceType, moveType: 'weapon', color:color }
                changeTurn(game.fen(),lastMove, color)
            }
        }
    }

    removePiece = (square) => {
        let { game, updateBoardFen, changeTurn } = this.props
        game.remove(square)
        game.load(game.fen())
        updateBoardFen(game.fen())
    }


    clickOnWeapon = (piece) => {
        const { clearSqaureClicked } = this.props
        this.setState({ weaponDeployed: true })
        clearSqaureClicked();   // need to clear to prevent collision with square clicking for moving pieces
    }

    componentDidUpdate(prevProps) {
        const { weaponDeployed, weaponRemoved, weaponFired } = this.state
        if (weaponDeployed) {
            if (!weaponRemoved && !weaponFired) {
                if (this.props.square !== prevProps.square) {
                    this.onUseWeapon()
                }
            }
            let lastMove = this.props.lastMove
            //weapon deployed and some move was played
            if (lastMove && !isEqual(lastMove, prevProps.lastMove)) {
                const { turns } = this.state
                if (turns > 0) {
                    this.setState(({ turns }) => ({ turns: turns - 1 }))
                    if (lastMove.from === this.currentWeaponSquare) { //the weapon moved
                        this.currentWeaponSquare = lastMove.to;
                    }
                }
                //if piece was taken by openent
                if (this.props.color != lastMove.color && lastMove.to === this.currentWeaponSquare) {
                    this.setState({ weaponRemoved: true });
                }//if weapon duration ended
                else if (!weaponRemoved && turns == 0) {
                    this.removePiece(this.currentWeaponSquare)
                    this.setState({ weaponRemoved: true });
                }
            }
        }
    }

    render() {
        const { options: { pieceType }, color } = this.props
        const { turns, weaponFired, weaponRemoved } = this.state

        let typeAndColorPiece = color + pieceType.toUpperCase();
        return (
            !weaponRemoved ? <BonusCard onClick={this.clickOnWeapon} disabled={weaponFired}>
                {defaultPieces[typeAndColorPiece]}
                <div>{turns}</div>
            </BonusCard> : null
        )
    }
}


const mapDispatchToProps = {

    removeWeapon: removeWeapon
}


export default connect(null, mapDispatchToProps)(addPiece)