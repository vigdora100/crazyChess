import React from "react";
import styled from "styled-components";
import PlayRandomMoveEngine from './integrations/PlayRandomMoveEngine';
import {get} from 'lodash'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation
} from "react-router-dom";

const Page = styled.div`
    display: flex;
    justify-content:  center;
    align-items: center;
`

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

export default function Home() {
    return (
        <Page>
            <Router>
                <Switch>
                    <Route path={'/PlayRandomMoveEngine'}><PlayRandomMoveEngine/></Route>
                    <Route path={'/'}>
                        <HomeMenu/>
                    </Route>
                </Switch>
            </Router>
        </Page>
    );
}


const HomeMenu = () => {
    return (
        <MenuBox>
            <MenuButton color='#2ecc40' to={'/PlayRandomMoveEngine'}>play against computer</MenuButton>
            <MenuButton color='#85144b' to={'/home'}> Home</MenuButton>
            <MenuButton color='#ffdc00'> click here</MenuButton>
            <MenuButton color='#dddddd'> click here</MenuButton>
        </MenuBox>
    )
}



