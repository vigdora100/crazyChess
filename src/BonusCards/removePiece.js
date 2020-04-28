import React from 'React'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {useWeapon} from './actions'

const BonusCard = styled.button`
    width:100px;
    height: 50px;
`

class RemovePiece extends React.Component {

    static onUseWeapon = (chessBoard, square) => {
        const {game} = chessBoard
        let isTherePiece = game.get(square)
        if (isTherePiece) {
            game.remove(square)
            game.load(game.fen()) //we need to load the game from scretch since we can't remove
            //an already moved piece - it is not enough removing
            chessBoard.setState({fen: game.fen()});
        }
    }


render() {
    const { useWeapon } = this.props

    return (<BonusCard onClick={() => useWeapon('REMOVE_PIECE')}> Remove piece </BonusCard>)
}
}

const mapDispatchToProps = {

    useWeapon: useWeapon
}


export default connect(null, mapDispatchToProps)(RemovePiece)