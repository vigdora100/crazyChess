import React from 'React'
import styled from 'styled-components'
import downgradeSign from '../Chessboard/svg/weapons/downgrade.svg';

const BonusCard = styled.button`
    display: flex;
    width:100px;
    height: 50px;
    justify-content: center;
    align-items: center;
    ${({buttonClicked})=> 
        (buttonClicked && `background-color: #ABB5BF`)}
`
class downGradePiece extends React.Component {
  
    render() {
        const { clickOnWeapon, options, index, buttonClicked } = this.props

        return (
           <BonusCard 
            buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('DowngradePiece',options, index)}>
                <img src={`/${downgradeSign}`}></img>
                <div>{options.duration}</div>
            </BonusCard> 
        )
    }
}

export default downGradePiece