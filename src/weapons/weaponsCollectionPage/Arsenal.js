import React,{Component} from 'react'
import { map } from 'lodash'
import { connect } from 'react-redux'
import styled from 'styled-components'
import weaponsLogic from '../weaponsLogic'
import defaultPieces from '../../ChessBoard/svg/chesspieces/standard';
import SmallCancel from '../../Chessboard/svg/weapons/smallCancel.svg';
import { removeWeapon } from '../../weapons/actions'

const ArsenalWrapper = styled.div`
    height: 300px;
    width: 336px;
    border-style: dashed;
    margin-right: 30px;
    margin-left: 30px;
    flex-wrap: wrap;
    flex-direction: row;
    display: flex;
    align-content: flex-start
`
const WeaponWrapper = styled.button`
    display: flex;
    width:100px;
    height: 50px;
    align-items: center;
    position: relative;
    margin: 5px;
`

const RemoveButton = styled.div`
    width: 22px;
    position: absolute;
    top: -12px;
    right: -10px;
`

const Weapon = (props) => {
        const { weaponType, weaponOptions: {pieceType: pieceType, duration: duration }, index, removeWeapon } = props
        return <WeaponWrapper>
                <RemoveButton onClick={()=>removeWeapon(index)} >
                <img src={`/${SmallCancel}`} ></img>
                </RemoveButton>
                {defaultPieces[pieceType]}
                {weaponsLogic[weaponType] && weaponsLogic[weaponType].weaponArsenalImage()}
                {duration}
                </WeaponWrapper>      
}

class Arsenal extends Component {

    
    render() {
        const { weaponsCollection, removeWeapon  }  = this.props;
        const weaponsArray = map(weaponsCollection, (weaponDetails, key)=>(
            <Weapon {...weaponDetails} key={key} index={key} removeWeapon={removeWeapon}/>
        ))
            return <ArsenalWrapper>
                    {weaponsArray}
                </ArsenalWrapper>
        }
} 

const mapStateToProps = (state) => {
       return  {
            weaponsCollection : state.weaponsCollection
        }
    }

const mapDispatchToProps = {
    removeWeapon: removeWeapon
}

export default connect(mapStateToProps,mapDispatchToProps)(Arsenal);