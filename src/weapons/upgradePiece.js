import React from 'React'
import styled from 'styled-components'
import upgradeSign from '../Chessboard/svg/weapons/upgrade.svg';

const BonusCard = styled.button`
    display: flex;
    width:100px;
    height: 50px;
    justify-content: center;
    align-items: center;
    ${({buttonClicked})=> 
        (buttonClicked && `background-color: #ABB5BF`)}
`
class upgradePiece extends React.Component {


    render() {
        const { clickOnWeapon, options, index, buttonClicked } = this.props

        return (
            <BonusCard buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('UpgradePiece',options, index)} >
                <img src={`/${upgradeSign}`}></img>
                <div>{options.duration}</div>
            </BonusCard> 
        )
    }
}

export default upgradePiece