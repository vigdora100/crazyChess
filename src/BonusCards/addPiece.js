import React, {useState} from 'React'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {removeWeapon} from './actions'
import {Button, Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';
import {get} from 'lodash';


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
        this.state = {popoverOpen: false,weaponChosen: false};
    }


     onUseWeapon = () => {
        const {game, square, color, updateBoardFen, removeWeapon} =  this.props
        const {pieceType} =  this.state
        //const {type, color} = get(weaponObj,'options.piece')
        let isTherePiece = game.get(square)
        if (!isTherePiece) {
            let piece = { type: pieceType, color: color }
            game.put(piece, square)
            game.load(game.fen()) //we need to load the game from scretch since we can't remove
            //an already moved piece - it is not enough removing
            updateBoardFen(game.fen());
            removeWeapon("ADD_PIECE")
        }
    }

     choosePiece = (piece) =>{
        const {useWeapon} = this.props;
        this.setState({weaponChosen: true, pieceType: piece.type})
     }

    componentDidUpdate(prevProps) {
        const { weaponChosen } = this.state
        if (this.props.square !== prevProps.square) {
            if(weaponChosen){
                this.onUseWeapon()
            }
        }
    }

    render() {
        const {useWeapon, square} = this.props
        const {popoverOpen} = this.state
        const toggle = () => this.setState({
            popoverOpen: !this.state.popoverOpen
        });

        return (
            <div>
                <BonusCard id="Popover1" type="button">
                    Add piece
                </BonusCard>
                <Popover placement="left" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                    <PopoverHeader>Popover Title</PopoverHeader>
                    <PopoverBody>
                        <PiecesWrapper>
                            <PieceButton onClick={()=>this.choosePiece({color: 'w', type: 'n'})}>
                                {defaultPieces.wN}
                            </PieceButton>
                            <PieceButton onClick={()=>this.choosePiece({color: 'w', type: 'p'})}>
                                {defaultPieces.wP}
                            </PieceButton>
                            <PieceButton onClick={()=>this.choosePiece({color: 'w', type: 'b'})}>
                                {defaultPieces.wB}
                            </PieceButton>
                            <PieceButton onClick={()=>this.choosePiece({color: 'w', type: 'r'})}>
                                {defaultPieces.wR}
                            </PieceButton>
                            <PieceButton onClick={()=>this.choosePiece({color: 'w', type: 'q'})}>
                                {defaultPieces.wQ}
                            </PieceButton>
                        </PiecesWrapper>
                    </PopoverBody>
                </Popover>
            </div>
        )
    }
}


const mapDispatchToProps = {

    removeWeapon: removeWeapon
}


export default connect(null, mapDispatchToProps)(addPiece)