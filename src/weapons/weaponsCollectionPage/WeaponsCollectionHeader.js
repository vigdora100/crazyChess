import styled from 'styled-components'
import React from 'react'

const HeaderWrapper = styled.div`
height: 150px;
widht: 100%;
dislay: flex;
justify-content: center;
`

const WeaponsCollectionHeader = ({ points, playerColor, token }) => {
    return <HeaderWrapper>
        {points}
        {playerColor}
        {token}
    </HeaderWrapper>
}

export default WeaponsCollectionHeader;