import React from 'react'
import styled from "styled-components";
import {Link} from "react-router-dom";



const MenuBox = styled.div`
  display: flex;
  border-color:  black;
  height: 500px;
  width: 500px;
  flex-direction: row;
  flex-wrap: wrap;
  `;


const MenuButton = styled(Link)`
  width: 245px;
  height:300px;
  background-color: ${({color}) => (color)};
  font-size: 22px;
  `;

const FindGame = styled.div`
  width: 245px;
  height:300px;
  background-color: ${({color}) => (color)};
  font-size: 22px;
  `;

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
            <MenuButton color='#2ecc40' to={'/PlayRandomMoveEngine'}> against computer</MenuButton>
            <MenuButton color='#85144b' to={'/home'}> Home</MenuButton>
            <MenuButton color='#ffdc00' to={'/playVSHuman'}> Start a game</MenuButton>
            <FindGame color='#ffdc00'>
                <Link to={`/playVSHuman/${value}`}> click here </Link>
                    <label>
                        Put the game code here:
                        <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    </label>
            </FindGame>
        </MenuBox>)
    }

}