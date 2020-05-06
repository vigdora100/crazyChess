import React from 'React'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {removeWeapon, useWeapon} from './actions'

const BonusCard = styled.button`
    width:100px;
    height: 50px;
`

class RemovePiece extends React.Component {

    constructor(props) {
        super(props);
        this.state = {weaponChosen: false};
    }

     onUseWeapon = () => {
        const {game, square, updateBoardFen,removeWeapon} = this.props
        let isTherePiece = game.get(square)
        if (isTherePiece) {
            game.remove(square)
            game.load(game.fen()) //we need to load the game from scretch since we can't remove
            //an already moved piece - it is not enough removing
            updateBoardFen(game.fen())
            removeWeapon("REMOVE_PIECE")
        }
    }

    componentDidUpdate(prevProps) {
        const { weaponChosen } = this.state
        if (this.props.square !== prevProps.square) {
            if(weaponChosen){
                this.onUseWeapon()
            }
        }
    }

    choosePieceToRemove = (piece) =>{
        const {useWeapon} = this.props;
        this.setState({weaponChosen: true, pieceType: piece.type})
    }


    render() {
    const { useWeapon } = this.props
    return (<BonusCard onClick={this.choosePieceToRemove}> Remove piece </BonusCard>)
}
}

const mapDispatchToProps = {

    removeWeapon: removeWeapon
}


export default connect(null, mapDispatchToProps)(RemovePiece)