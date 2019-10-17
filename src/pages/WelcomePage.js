import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import "./WelcomePage.scss";
import PropTypes from "prop-types";
import {postUser} from "../services/users";
import Background from "../components/Background";

class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {pseudo: ""};
    }
    onLogin = (event) => {
        event.preventDefault();
        postUser(this.state.pseudo)
            .then((response) => {
                this.props.history.push({pathname: "/lounge", state: {detail: response.data}});
            })
            .catch((error) => {
                if (error.response.status === 409) {
                    alert(
                        "A user with the pseudo " +
                            this.state.pseudo +
                            " is already connected. Please use another name"
                    );
                } else {
                    alert(error);
                }
            });
    };
    handleChange = (event) => {
        this.setState({pseudo: event.target.value});
    };
    render() {
        return (
            <Background>
                <div className="card">
                    <div className="card-content">
                        <p className="title is-1">Welcome on PaperBoard !</p>
                        <p className="subtitle">{"Don't think to much, draw it !"}</p>
                        <div className="card">
                            <div className="card-content" id="card-input">
                                <p className="title is-3">Your pseudo ?</p>
                                <div className="box">
                                    <div className="field">
                                        <p className="control has-icons-left">
                                            <form onSubmit={this.onLogin}>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Pseudo"
                                                    value={this.state.value}
                                                    onChange={this.handleChange}></input>
                                            </form>
                                        </p>
                                    </div>
                                    <div className="field">
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
