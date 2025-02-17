import styled from 'styled-components'
import React from 'react'

const HeaderWrapper = styled.div`
    height: 150px;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    background-color: #e8e4e4;
    border-color: black;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
`

const Points = styled.span`
        font-size: 70px;
    font-weight: 800;
    color: red;
    margin-right: 5px
`
const PointsWrapper = styled.div`

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
            <Points>{points}</Points><span>points</span>
        </PointsWrapper>
        <PlayerColorWrapper>
            <span>your color: </span><CirclePlayerColor color={playerColor}></CirclePlayerColor>
        </PlayerColorWrapper>
        {playerNumber == 'p1' ?  <GameToken>Game token: {token}</GameToken> : null }
    </HeaderWrapper>
}

export default WeaponsCollectionHeader;