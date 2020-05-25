import styled  from 'styled-components'
import React from 'React'

const InfoBoardWrapper = styled.div`
       height: 300px;
       width: 300px;
       border-style: dashed;
       margin-right: 30px;
       margin-left: 30px;

     
`
const Title = styled.h3`
    text-align: center
`


const InfoBoard = (props) => {
        return (
            <InfoBoardWrapper>
                <Title>
                    Information
                </Title>
            {props.children}
            </InfoBoardWrapper>
        )
}

export default InfoBoard