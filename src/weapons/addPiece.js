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
    constructor(props) {
        super(props);
        this.state = {
            turns: props.turns,
            piece: props.piece,
        }
    }

    render() {
        const { options , color, clickOnWeapon, index, buttonClicked } = this.props
        const { turns, weaponFired, weaponRemoved } = this.state

        let typeAndColorPiece = color + options.pieceType.toUpperCase();
        return (
            !weaponRemoved ? <BonusCard buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('AddPiece', options, index)} 
            disabled={weaponFired}>
                <img src={`/${PlusSign}`} ></img>
                {defaultPieces[typeAndColorPiece]}
                <div>{turns}</div>
                
            </BonusCard> : null
        )
    }
}


export default addPiece