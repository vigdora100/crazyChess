import React from 'React'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {removePiece} from './actions'

const BonusCard = styled.button`
    width:100px;
    height: 50px;
`

const RemovePiece = ({removePiece}) => {
    return (<BonusCard onClick={()=>removePiece()}> remove piece </BonusCard>)
}

const mapDispatchToProps = {

    removePiece: removePiece
}


export default connect(null,mapDispatchToProps)(RemovePiece)