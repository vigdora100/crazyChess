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
    constructor(props) {
        super(props);
        this.state = {
            turns: props.turns,
            piece: props.piece,
        }
    }

    render() {
        const { clickOnWeapon, options, index, buttonClicked } = this.props
        const { turns, weaponFired, weaponRemoved } = this.state

        return (
            !weaponRemoved ? <BonusCard buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('UpgradePiece',options, index)} 
            disabled={weaponFired}>
                <img src={`/${upgradeSign}`}></img>
                <div>{turns}</div>
            </BonusCard> : null
        )
    }
}

export default upgradePiece