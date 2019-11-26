import React, {Component} from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoungePage from "./pages/LoungePage";
import CreateBoardPage from "./pages/CreateBoardPage";
import PaperBoardPage from "./pages/PaperBoardPage";
import Toast from "light-toast";
import socketClientInstance from "./socket/socket";
import constants from "./config/constants";
import "./App.scss";
import PropTypes from "prop-types";

class App extends Component {
    constructor(props) {
        super(props);
        this.componentName = "App";
        this.timeouts = [];
        if (window.performance) {
            if (performance.navigation.type === 1 && this.props.location.pathname !== "/") {
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
            this.componentName
        );
    }

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_DISCONNECTED,
            this.handleDrawerDisconnected,
            this.componentName
        );
        while (this.timeouts.length > 0) {
            const t = this.timeouts.pop();
            clearTimeout(t);
        }
    }

    handleDrawerDisconnected = () => {
        Toast.fail(
            "You have been disconnected from server, you will be redirected to login page",
            3000,
            () => {}
        );
        this.timeouts.push(
            setTimeout(() => {
                if (this.props.location.pathname !== "/") {
                    this.props.history.push({
                        pathname: "/",
                    });
                }
                Toast.hide();
            }, 3000)
        );
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
