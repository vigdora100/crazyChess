import React from 'React'
import styled from 'styled-components'
import defaultPieces from '../ChessBoard/svg/chesspieces/standard';
import RemoveSign from '../Chessboard/svg/weapons/remove.svg';
import  { opponentColor }  from './helpers'

const WeaponWrappar = styled.button`
    display: flex;
    width:100px;
    height: 50px;
    align-items: center;
    ${({buttonClicked})=> 
        (buttonClicked && `background-color: #ABB5BF`)}
`

export default class RemovePiece extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { options, color, clickOnWeapon, index, buttonClicked } = this.props
        const { pieceType} = options;

        let typeAndColorPiece = opponentColor(color) + pieceType.toUpperCase();
        return (
            <WeaponWrappar buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('RemovePiece', options, index)}>
                <img src={`/${RemoveSign}`} ></img>
                {defaultPieces[typeAndColorPiece]}
                <div>{options.duration}</div>
                
            </WeaponWrappar>
        )
    }
}

