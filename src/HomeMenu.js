import React from 'react'
import styled from "styled-components";
import { Link } from "react-router-dom";



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
  width: 300px;
  height:130px;
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
    width: 285px;
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
    box-shadow:
    0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048),
    0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12)
  ;
  `;

const InputWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  `
const TimeButton = styled.div`
    width: 90px;
    height: 45px;
    background-color: #ff4d4f;
    &:hover {
        cursor: pointer
    }
    &:focus{
        background-color: #f32729
    }
    &:active{
        background-color: #f32729
    }
    border: solid #bf0103;
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: bold;
    justify-content: center;
`

const TimePicker = styled.div`
    border: solid #1890ff;
    background-color: #1890ff;
    width: 300px;
    height: 170px;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`

const StartGameWrapper = styled.div`
display: flex;
flex-direction: column; 
box-shadow:
0 2.8px 2.2px rgba(0, 0, 0, 0.034),
0 6.7px 5.3px rgba(0, 0, 0, 0.048),
0 12.5px 10px rgba(0, 0, 0, 0.06),
0 22.3px 17.9px rgba(0, 0, 0, 0.072),
0 41.8px 33.4px rgba(0, 0, 0, 0.086),
0 100px 80px rgba(0, 0, 0, 0.12)
;
`

const TimerColumn = styled.div`
    display: flex;
    flex-direction: column; 
    justify-content: space-around;
    height: 150px;
`



export default class HomeMenu extends React.Component {

    constructor() {
        super()
        this.state = { value: '', timer: 30000 }
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value })
    }

    setTimer = (time) => {
        this.setState({ timer: time })
    }

    render() {
        const { value, timer } = this.state
        return (<MenuBox>
            <StartGameWrapper>
                <MenuButton color='#ffdc00' to={{ pathname: '/Armory', state: { timer: timer } }}> Start a game
                </MenuButton>
                <TimePicker>
                    <TimerColumn>
                        <TimeButton tabIndex={'1'} onClick={() => this.setTimer(300000)}>5 Min</TimeButton>
                        <TimeButton tabIndex={'1'} onClick={() => this.setTimer(600000)}>10 Min</TimeButton>
                    </TimerColumn>
                    <TimerColumn>
                        <TimeButton tabIndex={'1'} onClick={() => this.setTimer(180000)}>3 Min</TimeButton>
                        <TimeButton tabIndex={'1'} onClick={() => this.setTimer(30000)}>30 Sec</TimeButton>
                    </TimerColumn>
                </TimePicker>
            </StartGameWrapper>
            <FindGame color='#ffdc00'>
                <InputWrapper>
                    Insert game code:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </InputWrapper>
                <Link to={`/Armory/${value}`}>  Join game </Link>
            </FindGame>
        </MenuBox>)
    }

}