import { MapWeaponPickersToClass } from '../MapWeaponCardsToClass'
import { mapKeys, get } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addWeapon } from '../actions'
import styled from 'styled-components';
import Arsenal from './Arsenal'
import WeaponsCollectionHeader from './WeaponsCollectionHeader'
import { piecePointsMap } from '../weaponsPickers/helpers'
import { Link } from "react-router-dom";
import Utils from "../../Chessboard/utils";
import ArrowRight from '../../Chessboard/svg/general/arrowRight.svg'

const WeaponsWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`

const WeaponsCollectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const ArrowWrapper = styled.img`
    width: 200px;
    height: 200px;
    &:hover {
        background-color: #DEDEDE;
    }`
   
const ArsenalLinkWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    margin-top: 10px;
`

class WeaponsCollection extends Component {

    state = {
        points: 250,
        token: '',
        playerColor: '',
        playerNumber: '',
        databaseId:  '',
    }

    async componentDidMount() {
        const { firebase } = window;
        let playerColor;
        let playerNumber;
        let databaseId;
        let timer; 
        let token = get(this, 'props.match.params.token')
        
        const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        //const { weaponCollection } = this.props
        if (!token) { //user created new game
            timer = get(this, 'props.location.state.timer')
            playerColor = Math.random() > 0.5 ? 'b' : 'w'
            playerNumber = 'p1';
            const newGameSetUp = {
                p1_token: Utils.token(),
                p2_token: Utils.token(),
                fen: STARTING_FEN,
                p1: {
                    color: playerColor,
                    weapons: {}
                },
                gameStatus: 'Playable',
                moveNumber: 1,
                initialTime: timer
            };
            const db = firebase.database().ref("games").push();   
            await db.set(newGameSetUp)
            token = newGameSetUp.p2_token;
            databaseId = db.getKey()
        }else {
            playerNumber = 'p2'
            const db = firebase.database().ref("/games")
            await db.orderByChild('p2_token').equalTo(token).once('value').then(function (snapshot) {
                const dbValue =  snapshot.val()
                const opponentColor = dbValue && dbValue[Object.keys(dbValue)[0]].p1.color;
                timer = dbValue && dbValue[Object.keys(dbValue)[0]].initialTime
                databaseId = Object.keys(dbValue)[0]
                playerColor = opponentColor == 'b' ? 'w' : 'b'
            }) 
        }
       
        this.setState({ token: token, playerColor: playerColor, playerNumber: playerNumber, databaseId:databaseId, timer: timer })
    }

    pointsAdd = (duration, piece) => {
        let piecePoints = 0;
        if (piece) {
            piecePoints = piecePointsMap[piece.toUpperCase()];
        }
        const toAdd = duration * 10 + piecePoints
        this.setState(({ points }) => ({ points: points + toAdd }));
    }

    pointsSub = (toSub) => {
        this.setState(({ points }) => ({ points: points - toSub }));
    }


    render() {
        let weapons = []
        const { points, token, playerColor, playerNumber,databaseId, timer } = this.state;

        mapKeys(MapWeaponPickersToClass, (Weapon, Key) => {
            weapons.push(<Weapon
                points={points}
                pointsSub={this.pointsSub}
                color={playerColor}
                onSubmit={this.onSubmit}
                piecePicked={this.piecePickd}
                clickOnWeapon={() => this.clickOnWeapon()} />
            )
        })
        return (
            <WeaponsCollectionWrapper>
                <WeaponsCollectionHeader points={points} playerColor={playerColor} token={token} playerNumber={playerNumber} />
                <WeaponsWrapper>
                    {weapons}
                </WeaponsWrapper>
                    <ArsenalLinkWrapper>                
                    <Arsenal addPoints={this.pointsAdd} playerColor={playerColor}></Arsenal>
                    <Link color='#ffdc00' to={{ pathname: `/StartGame/${token}/${playerColor}/${playerNumber}/${databaseId}`, state: { 
                        playerColor: playerColor, playerNumber:playerNumber, databaseId:databaseId, timer: timer } }}> 
                        <ArrowWrapper src={`/${ArrowRight}`}></ArrowWrapper>
                    </Link>
                    </ArsenalLinkWrapper>
            </WeaponsCollectionWrapper>

        )
    }
}

const mapDispatchToProps = {
    addWeapon: addWeapon
}

export default connect(null, mapDispatchToProps)(WeaponsCollection)