import React from 'react'
import styled from "styled-components";
import {Link} from "react-router-dom";



const MenuBox = styled.div`
  display: flex;
  border-color:  black;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  `;


const MenuButton = styled(Link)`
  width: 245px;
  height:300px;
  background-color: #1890ff;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  &:hover{
    color: #fff;
    background: #40a9ff;
    border-color: #40a9ff;
  }
  `;

const FindGame = styled.div`
    width: 245px;
    color: #fff;
    height: 300px;
    background-color: #ff4d4f;
    font-size: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    &:hover{
        color: #fff;
        background: #ff7875;;
        border-color: #ff7875;;
      }
    & input{
        color: black;
    }
    & a{
        color: #fff;
        &:hover{
            color: #1890ff;
          }
    }
  `;

  const InputWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  `

export default class HomeMenu extends React.Component {

    constructor(){
        super()
        this.state = {value: ''}
    }

    handleChange = (event) => {
        this.setState({value: event.target.value})
    }

    render(){
        const { value } = this.state
        return (<MenuBox>
            <MenuButton color='#ffdc00' to={'/Armory'}> Start a game</MenuButton>
            <FindGame color='#ffdc00'>
                <InputWrapper>
                    Insert game code:
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </InputWrapper>
                <Link to={`/Armory/${value}`}>  Join game </Link>
            </FindGame>
        </MenuBox>)
    }

}