import styled  from 'styled-components'
import React from 'React'

const ArsenalWrapper = styled.div`
       height: 300px;
       width: 300px;
       border-style: dashed;
       margin-right: 30px;

     
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
            {props.children}
            </ArsenalWrapper>
        )
}

export default Arsenal