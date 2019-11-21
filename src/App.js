import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoungePage from "./pages/LoungePage";
import CreateBoardPage from "./pages/CreateBoardPage";
import PaperBoardPage from "./pages/PaperBoardPage";
import Toast from "light-toast";
import socketClientInstance from "./services/socket";
import constants from "./config/constants";
import "./App.scss";
import PropTypes from "prop-types";

require("dotenv").config();

class App extends Component {
    constructor(props) {
        super(props);
        if (window.performance) {
            if (performance.navigation.type === 1) {
                alert(
                    "This page is reloaded, you will be disconnected and redirected to the login page"
                );
                this.props.history.push({
                    pathname: "/",
                });
            }
        }
    }

    componentDidMount() {
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_DISCONNECTED,
            this.handleDrawerDisconnected,
            this
        );
    }

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_DISCONNECTED,
            this.handleDrawerDisconnected,
            this
        );
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    handleDrawerDisconnected = () => {
        Toast.fail(
            "You have been disconnected from server, you will be redirected to login page",
            3000,
            () => {}
        );
        this.timeout = setTimeout(() => {
            this.props.history.push({
                pathname: "/",
            });
            Toast.hide();
        }, 3000);
    };

    render() {
        return (
            <Switch>
                <Route exact path="/" component={WelcomePage} />
                <Route path="/lounge" component={LoungePage} />
                <Route path="/new-board" component={CreateBoardPage} />
                <Route path="/paperboard/:title" component={PaperBoardPage} />
            </Switch>
        );
    }
}

App.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};
export default withRouter(App);
