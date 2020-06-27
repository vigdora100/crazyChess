import { MapWeaponPickersToClass } from '../MapWeaponCardsToClass'
import { mapKeys } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addWeapon } from '../actions'
import styled from 'styled-components';
import Arsenal from './Arsenal'
import WeaponsCollectionHeader from './WeaponsCollectionHeader'
import { piecePointsMap } from '../weaponsPickers/helpers'

const WeaponsWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`


const WeaponsCollectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

class WeaponsCollection extends Component {
    
     state = { points : 150}

    pointsAdd = (weaponType, duration, piece) => {
        let piecePoints = 0;
        if(piece){
            const pieceFL = piece[1];
            piecePoints = piecePointsMap[pieceFL];
        }
        const toAdd = duration*10+piecePoints
        this.setState(({points}) => ({ points: points+toAdd }));
    }

    pointsSub = (toSub) => {
        this.setState(({points}) => ({ points: points-toSub }));
    }


    render() {
        let weapons = []
        const { points } = this.state;
        mapKeys(MapWeaponPickersToClass, (Weapon, Key) => {
            weapons.push(<Weapon
                points={points}
                pointsSub={this.pointsSub}
                color={'w'}
                onSubmit={this.onSubmit}
                piecePicked={this.piecePickd}
                clickOnWeapon={() => this.clickOnWeapon()} />
            )
        })
        return (
            <WeaponsCollectionWrapper>
                <WeaponsCollectionHeader points={points}/>
                <WeaponsWrapper>
                    {weapons}
                </WeaponsWrapper>
                <Arsenal addPoints={this.pointsAdd}></Arsenal>
            </WeaponsCollectionWrapper>


        )
    }
}

const mapDispatchToProps = {
    addWeapon: addWeapon
}

export default connect(null, mapDispatchToProps)(WeaponsCollection)