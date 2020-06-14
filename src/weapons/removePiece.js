import React from 'React'
import styled from 'styled-components'
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';
import RemoveSign from '../Chessboard/svg/weapons/remove.svg';
import  { opponentColor }  from './helpers'

const BonusCard = styled.button`
    display: flex;
    width:100px;
    height: 50px;
    align-items: center;
    ${({buttonClicked})=> 
        (buttonClicked && `background-color: #ABB5BF`)}
`

class removePiece extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            turns: props.turns,
            piece: props.piece,
        }
    }

    render() {
        const { options, color, clickOnWeapon, index, buttonClicked } = this.props
        const { pieceType} = options;
        const { turns, weaponFired, weaponRemoved } = this.state

        let typeAndColorPiece = opponentColor(color) + pieceType.toUpperCase();
        return (
            !weaponRemoved ? <BonusCard buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('RemovePiece', options, index)}
             disabled={weaponFired}>
                <img src={`/${RemoveSign}`} ></img>
                {defaultPieces[typeAndColorPiece]}
                <div>{turns}</div>
                
            </BonusCard> : null
        )
    }
}

export default removePiece