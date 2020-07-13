import styled from 'styled-components'
import React from 'react'

const HeaderWrapper = styled.div`
    height: 150px;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    background-color: #1890ff;
    border-color: black;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
`

const Points = styled.span`
    font-size: 70px;
    font-weight: 800;
    color: #ff4d4f;
    margin-right: 5px
`

const ColorText = styled.span`
font-size: 30px;
font-weight: 800;
color: #ff4d4f;
margin-right: 5px
`

const PointsWrapper = styled.div`
    color: #ff4d4f;
    font-size: 25px;
    font-weight: 600;
`

const PointsText = styled.span`
 
`


const PlayerColorWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const CirclePlayerColor = styled.div`
    height: 50px;
    width: 50px;
    background-color: ${({color})=>(color == 'w' ? 'white' : 'black') };
    border-radius: 50%;
    display: inline-block;
    margin-left: 10px
`

const GameToken = styled.div`
    position: absolute;
    top: 3px;
    right: 3px;
`

const WeaponsCollectionHeader = ({ points, playerColor, playerNumber,  token }) => {
    return <HeaderWrapper>
        <PointsWrapper>
            <Points>{points}</Points><PointsText>points</PointsText>
        </PointsWrapper>
        <PlayerColorWrapper>
            <ColorText>your color: </ColorText><CirclePlayerColor color={playerColor}></CirclePlayerColor>
        </PlayerColorWrapper>
        {playerNumber == 'p1' ?  <GameToken>Game token: {token}</GameToken> : null }
    </HeaderWrapper>
}

export default WeaponsCollectionHeader;