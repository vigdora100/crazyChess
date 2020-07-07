import React from "react";
import styled from "styled-components";
import PlayRandomMoveEngine from './integrations/PlayRandomMoveEngine';
import HumanVsHuman from './integrations/HumanVsHuman';
import { get } from 'lodash'
import Utils from './Chessboard/utils'
import { browserHistory } from 'react-router'
import HomeMenu from './HomeMenu'
import WeaponsCollection from '../src/weapons/weaponsCollectionPage/WeaponsCollection'

const { firebase } = window;

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    HashRouter,
    Redirect
} from "react-router-dom";

const Page = styled.div`
    display: flex;
    justify-content:  center;
    align-items: center;
`



const HumanVsHumanButton = styled.button`
  width: 245px;
  height:300px;
  background-color: ${({ color }) => (color)};
  font-size: 22px;
  `;



const HumanVsHumanInit = () => {
    const newGame = {
        p1_token: Utils.token(),
        p2_token: Utils.token()
    };

    const game = firebase.database().ref("games").push();

    game.set(newGame)
        .then(() => {
            return <HumanVsHuman token={newGame.p1_token} />
        }, (err) => {
            throw err;
        });

}

export default function Home() {
    return (
        <Page>
            <Router>
                <Switch>
                    <Route exact path={`/StartGame/:token/:playerColor/:playerNumber/:databaseId`} component={HumanVsHuman}></Route>
                    <Route exact path={`/Armory/:token`} component={WeaponsCollection}></Route>
                    <Route path={`/Armory`} component={WeaponsCollection}></Route>
                    <HomeMenu />
                </Switch>
            </Router>
        </Page>
    );
}










