import React from 'react'
import { connect } from 'react-redux'
import {addWeapon} from '../../weapons/actions'
import styled from 'styled-components'
import defaultPieces from '../../ChessBoard/svg/chesspieces/standard';
import RemoveSign from '../../Chessboard/svg/weapons/remove.svg';
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
class removePiecePicker extends React.Component {
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
        const { piece, numberOfTurns} = this.state
        const pieceType = piece[0]
        pointsSub(weaponPointsCalc(piecePointsMap[pieceType],numberOfTurns))
        let weaponOptions = { duration: numberOfTurns, pieceType: pieceType.toLowerCase()  }
        addWeapon('RemovePiece', weaponOptions)
    }

    render() {
        const { piece, numberOfTurns } = this.state
        const { color, points } = this.props
        const piecesMenu = (
            <Menu onClick={this.handlePieceClick}>
                <Menu.Item key={`${color}Q-Queen`} icon={defaultPieces[`${color}Q`]} disabled={points<piecePointsMap['Q']} >
                {piecePointsMap['Q']} points
              </Menu.Item>
              <Menu.Item key={`${color}R-Rock`} icon={defaultPieces[`${color}R`]} disabled={points<piecePointsMap['R']} >
                {piecePointsMap['R']}  points
              </Menu.Item>
              <Menu.Item key={`${color}P-Pawn`} icon={defaultPieces[`${color}P`]} disabled={points<piecePointsMap['P']} >
                {piecePointsMap['P']}  points
              </Menu.Item>
              <Menu.Item key={`${color}B-Bishop`} icon={defaultPieces[`${color}B`]} disabled={points<piecePointsMap['B']}>
                {piecePointsMap['B']} points
              </Menu.Item>
              <Menu.Item key={`${color}K-Knight`} icon={defaultPieces[`${color}K`]} disabled={points<piecePointsMap['K']}>
                {piecePointsMap['K']} points
              </Menu.Item>
            </Menu>
          );

          const numberOfTurnsMenu = (chosenPiece) => {
            const pieceFL = piece[0]
            return(
            <Menu onClick={this.handleTurnsClick}>
              <Menu.Item key="3" disabled={points<3*10+piecePointsMap[pieceFL]} >
                3
              </Menu.Item>
              <Menu.Item key="5" disabled={points<5*10+piecePointsMap[pieceFL]}>
                5
              </Menu.Item>
              <Menu.Item key="7" disabled={points<7*10+piecePointsMap[pieceFL]}>
                7
              </Menu.Item>
              <Menu.Item key="9" disabled={points<9*10+piecePointsMap[pieceFL]}>
                9
              </Menu.Item>
              <Menu.Item key="12" disabled={points<9*10+piecePointsMap[pieceFL]}>
                12
              </Menu.Item>
            </Menu>
          );
            }

        const isTurnPickerDisabled = piece ? false : true
        const minimumPoints = piecePointsMap['P'] + 3*10
        const isSubmitDisasbled = !piece && !numberOfTurns || minimumPoints > points ? true: false 
        return (
            <CardWrapper title="Remove Piece" extra={<img src={`/${RemoveSign}`}></img>}>
            <WeaponPickerWrappar >
                        <Dropdown.Button onClick={this.handleButtonClick} overlay={piecesMenu}>
                         {piece ?  piece :  'pick a piece'}
                        </Dropdown.Button>
                        <Dropdown.Button onClick={this.handleButtonClick} overlay={numberOfTurnsMenu}
                         disabled={isTurnPickerDisabled}>
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

export default connect(null,mapDispatchToProps)(removePiecePicker)
