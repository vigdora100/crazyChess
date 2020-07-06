
import React from 'react'
import { connect } from 'react-redux'
import { addWeapon } from '../../weapons/actions'
import styled from 'styled-components'
import defaultPieces from '../../ChessBoard/svg/chesspieces/standard';
import PlusSign from '../../Chessboard/svg/weapons/plus.svg';
import 'react-dropdown-now/style.css';
import 'antd/dist/antd.css';
import { Button, Dropdown, Menu, Card } from 'antd';
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

const PieceMenuRow = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
`

class addPiecePicker extends React.Component {
  state = {
    piece: '',
    numberOfTurns: '',
  }

  handlePieceClick = (e) => {
    const pieceName = e.key.split("-")[1]
    this.setState({ piece: pieceName })
  }

  handleTurnsClick = (e) => {
    this.setState({ numberOfTurns: e.key })
  }

  handleButtonClick = (e) => {
    console.log('click left button', e);
  }

  piecePicekd = (piece) => {
    this.setState({ 'piece': piece })
  }

  onSubmit = () => {
    const { addWeapon, pointsSub } = this.props
    const { piece, numberOfTurns } = this.state
    const pieceType = piece[0]
    pointsSub(weaponPointsCalc(piecePointsMap[pieceType], numberOfTurns))
    let weaponOptions = { duration: numberOfTurns, pieceType: pieceType.toLowerCase() }
    addWeapon('AddPiece', weaponOptions)
  }

  render() {
    const { piece, numberOfTurns } = this.state
    const { color, points } = this.props
    console.log('color: ',  color)
    const piecesMenu = (
      <Menu onClick={this.handlePieceClick}>
        <Menu.Item key={`${color}Q-Queen`} disabled={points < piecePointsMap['Q']} >
          <PieceMenuRow> {defaultPieces[`${color}Q`]} {piecePointsMap['Q']} points </PieceMenuRow>
        </Menu.Item>
        <Menu.Item key={`${color}R-Rock`} disabled={points < piecePointsMap['R']} >
          <PieceMenuRow> {defaultPieces[`${color}R`]} {piecePointsMap['R']} points </PieceMenuRow>
        </Menu.Item>
        <Menu.Item key={`${color}P-Pawn`} disabled={points < piecePointsMap['P']} >
          <PieceMenuRow> {defaultPieces[`${color}P`]} {piecePointsMap['P']} points </PieceMenuRow>
        </Menu.Item>
        <Menu.Item key={`${color}B-Bishop`} disabled={points < piecePointsMap['B']}>
          <PieceMenuRow> {defaultPieces[`${color}B`]} {piecePointsMap['B']} points </PieceMenuRow>
        </Menu.Item>
        <Menu.Item key={`${color}N-Knight`} disabled={points < piecePointsMap['N']}>
          <PieceMenuRow> {defaultPieces[`${color}N`]} {piecePointsMap['N']} points </PieceMenuRow>
        </Menu.Item>
      </Menu>
    );

    const numberOfTurnsMenu = () => {
      const pieceFL = piece[0]
      return (
        <Menu onClick={this.handleTurnsClick}>
          <Menu.Item key="3" disabled={points < 3 * 10 + piecePointsMap[pieceFL]} >
            {`3 turns - (${3 * 10}  points)`}
              </Menu.Item>
          <Menu.Item key="5" disabled={points < 5 * 10 + piecePointsMap[pieceFL]}>
            {`5 turns - (${5 * 10}  points)`}
              </Menu.Item>
          <Menu.Item key="7" disabled={points < 7 * 10 + piecePointsMap[pieceFL]}>
            {`7 turns - (${7 * 10}  points)`}
              </Menu.Item>
          <Menu.Item key="9" disabled={points < 9 * 10 + piecePointsMap[pieceFL]}>
            {`9 turns -  (${9 * 10}  points)`}
              </Menu.Item>
          <Menu.Item key="12" disabled={points < 9 * 10 + piecePointsMap[pieceFL]}>
            {`12 turns - (${12 * 10}  points)`}
              </Menu.Item>
        </Menu>
      );
    }
    const isTurnPickerDisabled = piece ? false : true
    const minimumPoints = piecePointsMap['P'] + 3 * 10
    const isSubmitDisasbled = !piece || !numberOfTurns || minimumPoints > points 
    return (
      <CardWrapper title="Add Piece" extra={<img src={`/${PlusSign}`}></img>}>
        <WeaponPickerWrappar>
          <Dropdown.Button onClick={this.handleButtonClick} overlay={piecesMenu}>
            {piece ? piece : 'pick a piece'}
          </Dropdown.Button>
          <Dropdown.Button onClick={this.handleButtonClick} overlay={numberOfTurnsMenu}
            disabled={isTurnPickerDisabled}>
            {numberOfTurns ? numberOfTurns : 'pick number of turns'}
          </Dropdown.Button>
          <Button type="primary" onClick={() => this.onSubmit()} disabled={isSubmitDisasbled}>order weapon </Button>
        </WeaponPickerWrappar>
      </CardWrapper>
    )
  }
}

const mapDispatchToProps = {
  addWeapon: addWeapon
}

export default connect(null, mapDispatchToProps)(addPiecePicker)
