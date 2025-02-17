import React from 'react'
import { connect } from 'react-redux'
import {addWeapon} from '../../weapons/actions'
import styled from 'styled-components'
import upgradeSign from '../../Chessboard/svg/weapons/upgrade.svg';
import 'react-dropdown-now/style.css';
import 'antd/dist/antd.css';
import {  Button, Dropdown, Menu, Card  } from 'antd';
import { piecePointsMap, weaponPointsCalc } from './helpers'

const WeaponPickerWrappar = styled.div`
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 130px;
    justify-content: space-evenly;
`

const CardWrapper = styled(Card)`
    border: 3px solid #f0f0f0;
    margin-right: 5px;

`
class upgradePiecePicker extends React.Component {
    state =  {
        piece: '',
        numberOfTurns: 0,
    }

    handlePieceClick = (e) => {
        const pieceName = e.key.split("-")[1]
        this.setState({piece: pieceName})
    }

    handleTurnsClick = (e) => {
        this.setState({numberOfTurns: e.key})
    }

    handleButtonClick = (e) => {
        console.log('click left button', e);
      }
      
    piecePicekd = (piece) => {
        this.setState({'piece': piece})
    }

    onSubmit = () => {
        const { addWeapon, pointsSub } =  this.props
        const { numberOfTurns} = this.state
        pointsSub(weaponPointsCalc(0,numberOfTurns))
        let weaponOptions = { duration: numberOfTurns  }
        addWeapon('UpgradePiece', weaponOptions)
    }

    render() {
        const { numberOfTurns } = this.state
        const {  points } = this.props
        
          const numberOfTurnsMenu = (
             <Menu onClick={this.handleTurnsClick}>
             <Menu.Item key="3" disabled={points<3*10} >
               {`3 turns - (${3 * 10}  points)`}
                 </Menu.Item>
             <Menu.Item key="5" disabled={points<5*10}>
               {`5 turns - (${5 * 10}  points)`}
                 </Menu.Item>
             <Menu.Item key="7" disabled={points<7*10}>
               {`7 turns - (${7 * 10}  points)`}
                 </Menu.Item>
             <Menu.Item key="9" disabled={points<9*10}>
               {`9 turns -  (${9 * 10}  points)`}
                 </Menu.Item>
             <Menu.Item key="12" key="12" disabled={points<12*10}>
               {`12 turns - (${12 * 10}  points)`}
                 </Menu.Item>
           </Menu>
          )
        
        const minimumPoints =  3*10
        const isSubmitDisasbled = numberOfTurns && points >= minimumPoints ? false: true
        return (
            <CardWrapper title="Downgrade Piece" extra={<img src={`/${upgradeSign}`}></img>}>
            <WeaponPickerWrappar >
                        <Dropdown.Button onClick={this.handleButtonClick} overlay={numberOfTurnsMenu}>
                         {numberOfTurns ?  numberOfTurns :  'pick number of turns'}
                        </Dropdown.Button>
                        <Button type="primary" onClick={()=>this.onSubmit()} disabled={isSubmitDisasbled}>order weapon </Button>
                </WeaponPickerWrappar> 
                </CardWrapper>
            )
    }
}

const mapDispatchToProps = {
    addWeapon: addWeapon
}

export default connect(null,mapDispatchToProps)(upgradePiecePicker)


