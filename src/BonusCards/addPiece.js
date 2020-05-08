import React, { useState } from 'React'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { removeWeapon } from './actions'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';
import { get } from 'lodash';


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
        this.state = { popoverOpen: false, weaponChosen: false, turns: props.turns, 
            piece: props.piece}
        this.lastSquare =  ''  
    }




    onUseWeapon = () => {
        const { game, square, color, updateBoardFen,
             options:{pieceType: pieceType} } = this.props
        let isTherePiece = game.get(square)
        if (game.turn() === color) {
            if (!isTherePiece) {
                let piece = { type: pieceType, color: color }
                game.put(piece, square)
                game.load(game.fen()) //we need to load the game from scretch since we can't remove
                //an already moved piece - it is not enough removing
                updateBoardFen(game.fen());
                this.lastSquare = square;
            }
        }
    }

    removePiece =(square) =>{
        let {game, updateBoardFen} = this.props
        game.remove(square)
        game.load(game.fen()) 
        updateBoardFen(game.fen())
    }


    clickOnWeapon = (piece) => {
        this.setState({ weaponChosen: true})
    }

    componentDidUpdate(prevProps) {
        const { weaponChosen, turns } = this.state
        if (this.props.square !== prevProps.square) {
            if(weaponChosen){
                this.onUseWeapon()
            }
        }
        let lastMove = this.props.lastMove
        if(lastMove && lastMove !== prevProps.lastMove && weaponChosen){
                const { turns } = this.state
                if(turns > 0){
                    let updatedTurnNumber = turns-1;
                    console.log('updatedTurnNumber :' , updatedTurnNumber)
                    this.setState({turns: updatedTurnNumber})
                    if(lastMove.from === this.lastSquare){
                            this.lastSquare = lastMove.to;
                    }
                }
                if(turns==0){
                    this.props.removeWeapon("ADD_PIECE")
                    this.removePiece(this.lastSquare)
                }
        }
    }

    render() {
        const { options:{pieceType}, color } = this.props
        const { turns } = this.state     

        let typeAndColorPiece = color + pieceType.toUpperCase();
        return (
            <BonusCard onClick={this.clickOnWeapon}>
                {defaultPieces[typeAndColorPiece]}
                    <div>{turns}</div>
            </BonusCard>
        )
    }
}


const mapDispatchToProps = {

    removeWeapon: removeWeapon
}


export default connect(null, mapDispatchToProps)(addPiece)