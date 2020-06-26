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
            !weaponRemoved ? <BonusCard 
            buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('DowngradePiece',options, index)} disabled={weaponFired}>
                <img src={`/${downgradeSign}`}></img>
                <div>{turns}</div>
            </BonusCard> : null
        )
    }
}

export class downgradePiecePicker extends React.Component {
    
    render() {
        const { clickOnWeapon,buttonClicked} = this.props
        return (
          <BonusCard buttonClicked={buttonClicked} 
            onClick={()=>clickOnWeapon('DowngradePiece')}>
                <img src={`/${downgradeSign}`}></img>
            </BonusCard> 
        )
    }
}

export default downGradePiece