import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import "./WelcomePage.scss";
import PropTypes from "prop-types";
import Background from "./Background";
import socketClientInstance from "../socket/socket";
import constants from "../config/constants";
import * as backgroundImage from "../assets/welcome.jpg";

class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {pseudo: ""};
        this.componentName = "WelcomePage";
        socketClientInstance.init();
    }

    componentDidMount() {
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.IDENTIFY_ANSWER,
            this.handleServerLoginAnswer,
            this.componentName
        );
    }

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.IDENTIFY_ANSWER,
            this.handleServerLoginAnswer,
            this.componentName
        );
    }

    onLogin = (event) => {
        event.preventDefault();
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.IDENTIFY,
            from: "client",
            to: "server",
            payload: {pseudo: this.state.pseudo},
        });
    };

    handleServerLoginAnswer = (data) => {
        if (data.payload.pseudoAvailable && this.state.pseudo) {
            this.props.history.push({
                pathname: "/lounge",
                state: {pseudo: this.state.pseudo},
            });
        } else {
            alert(
                "A user with the pseudo " +
                    this.state.pseudo +
                    " is already connected. Please use another name"
            );
        }
    };

    handleChange = (event) => {
        this.setState({pseudo: event.target.value});
    };

    render() {
        return (
            <Background
                customStyle={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                imgSrc={backgroundImage}>
                <div className="card" style={{width: "fit-content", borderRadius: "10px"}}>
                    <div
                        className="card-content"
                        style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <p className="title is-1" style={{textAlign: "center"}}>
                            Welcome on PaperBoard !
                        </p>
                        <p className="subtitle is-4" style={{textAlign: "center"}}>
                            Don't think too much, draw it !
                        </p>
                        <div className="card" style={{width: "fit-content", borderRadius: "10px"}}>
                            <div
                                className="card-content"
                                id="card-input"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}>
                                <p className="title is-3">Your pseudo ?</p>
                                <div className="box">
                                    <form onSubmit={this.onLogin}>
                                        <div className="field">
                                            <p className="control has-icons-left">
                                                <input
                                                    type="text"
                                                    className="input is-success is-medium"
                                                    placeholder="Pseudo"
                                                    value={this.state.value}
                                                    onChange={this.handleChange}></input>
                                            </p>
                                        </div>
                                    </form>
                                    <div className="field" style={{marginTop: 15}}>
                                        <p className="control">
                                            <button
                                                className="button is-success is-large"
                                                onClick={this.onLogin}>
                                                Go !
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Background>
        );
    }
}

WelcomePage.propTypes = {
    history: PropTypes.object,
};

export default withRouter(WelcomePage);
