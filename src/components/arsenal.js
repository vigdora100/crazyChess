import styled  from 'styled-components'
import React from 'React'

const ArsenalWrapper = styled.div`
       height: 300px;
       width: 300px;
       border-style: dashed;
       margin-right: 30px;
       margin-left: 30px;
`

const WeaponsWrapper = styled.div`
    flex-wrap: wrap;
    display: flex;
`

const Title = styled.h3`
    text-align: center
`


const Arsenal = (props) => {
        return (
            <ArsenalWrapper>
                <Title>
                    Arsenal
                </Title>
                <WeaponsWrapper>
                    {props.children}
                </WeaponsWrapper>
            </ArsenalWrapper>
        )
}

export default Arsenal