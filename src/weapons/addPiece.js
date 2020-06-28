import React from 'React'
import styled from 'styled-components'
import PlusSign from '../Chessboard/svg/weapons/plus.svg';
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';

const BonusCard = styled.button`
    display: flex;
    width:100px;
    height: 50px;
    align-items: center;
    ${({buttonClicked})=> 
        (buttonClicked && `background-color: #ABB5BF`)}
`

class addPiece extends React.Component {
 
    render() {
        const { options , color, clickOnWeapon, index, buttonClicked } = this.props

        let typeAndColorPiece = color + options.pieceType.toUpperCase();
        return (
           <BonusCard buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('AddPiece', options, index)}>
                <img src={`/${PlusSign}`} ></img>
                {defaultPieces[typeAndColorPiece]}
                <div>{options.duration}</div>
                
            </BonusCard> 
        )
    }
}


export default addPiece