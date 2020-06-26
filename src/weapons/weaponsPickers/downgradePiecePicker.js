import React from 'react'
import { connect } from 'react-redux'
import {addWeapon } from '../../weapons/actions'
import styled from 'styled-components'
import defaultPieces from '../../ChessBoard/svg/chesspieces/standard';
import downgradeSign from '../../Chessboard/svg/weapons/downgrade.svg';
import 'react-dropdown-now/style.css';
import 'antd/dist/antd.css';
import {  Button, Dropdown, Menu, Card  } from 'antd';


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
class downgradePiecePicker extends React.Component {
    state =  {
        modalIsOpen: false,
        piece: '',
        numberOfTurns: 0,
        value: '',
    }

    handlePieceClick = (e) => {
        this.setState({piece: e.key})
    }

    handleTurnsClick = (e) => {
        this.setState({numberOfTurns: e.key})
    }

    handleButtonClick = (e) => {
        console.log('click left button', e);
      }
      
    clickOnWeapon= ()=>{
        this.setState({modalIsOpen:true})
    }

    piecePicekd = (piece) => {
        this.setState({'piece': piece})
    }

    onSubmit = () => {
        const { addWeapon } =  this.props
        const { piece, numberOfTurns} = this.state
        let weaponOptions = { duration: numberOfTurns }
        addWeapon('DowngradePiece', weaponOptions)
    }

    turnsInserted = (event) => {
        this.setState({numberOfTurns: event.target.value});
    } 

    render() {

        const piecesMenu = (
            <Menu onClick={this.handlePieceClick}>
                <Menu.Item key="Queen" icon={defaultPieces['wQ']} >
                20 points
              </Menu.Item>
              <Menu.Item key="Rook" icon={defaultPieces['wR']} >
                10 points
              </Menu.Item>
              <Menu.Item key="Pawn" icon={defaultPieces['wP']} >
                3rd item
              </Menu.Item>
              <Menu.Item key="Bishop" icon={defaultPieces['wB']} >
                3rd item
              </Menu.Item>
              <Menu.Item key="Knight" icon={defaultPieces['wN']} >
                3rd item
              </Menu.Item>
            </Menu>
          );

          const numberOfTurnsMenu = (
            <Menu onClick={this.handleTurnsClick}>
              <Menu.Item key="3">
                3
              </Menu.Item>
              <Menu.Item key="5">
                5
              </Menu.Item>
              <Menu.Item key="7">
                7
              </Menu.Item>
              <Menu.Item key="9">
                9
              </Menu.Item>
              <Menu.Item key="12">
                12
              </Menu.Item>
            </Menu>
          );

    
        const { piece, numberOfTurns } = this.state
        return (
            <CardWrapper title="Downgrade Piece" extra={<img src={`/${downgradeSign}`}></img>}>
            <WeaponPickerWrappar>
                        <Dropdown.Button onClick={this.handleButtonClick} overlay={numberOfTurnsMenu}>
                         {numberOfTurns ?  numberOfTurns :  'pick number of turns'}
                        </Dropdown.Button>
                        <Button type="primary" onClick={()=>this.onSubmit()}>order weapon </Button>
                </WeaponPickerWrappar> 
                </CardWrapper>
            )
    }
}

const mapDispatchToProps = {
    addWeapon: addWeapon
}

export default connect(null,mapDispatchToProps)(downgradePiecePicker)
