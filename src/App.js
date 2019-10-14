import React from "react";
import {Route, Switch} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoungePage from "./pages/LoungePage";
import CreateBoardPage from "./pages/CreateBoardPage";
import PaperBoardPage from "./pages/PaperBoardPage";
import "./App.scss";
require("dotenv").config();

export default function App() {
    return (
        <Switch>
            <Route exact path="/" component={WelcomePage} />
            <Route path="/lounge" component={LoungePage} />
            <Route path="/new-board" component={CreateBoardPage} />
            <Route path="/paperboard/:title" component={PaperBoardPage} />
        </Switch>
    );
}
