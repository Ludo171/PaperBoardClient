import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import * as backgroundImage from "../assets/background-image2.jpg";
import "./WelcomePage.scss";
import PropTypes from "prop-types";
import {postUser} from "../services/users";

class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {pseudo: ""};
    }
    resizeImageToFill(e) {
        let targetWidth;
        let targetHeight;
        const container = document.getElementById("welcome-page");
        const containerProp = container.clientHeight / container.clientWidth;
        const img = document.getElementById("background-image");
        const imgProp = img.height / img.width;

        if (containerProp > imgProp) {
            targetHeight = container.clientHeight;
            targetWidth = targetHeight / imgProp;
        } else {
            targetWidth = container.clientWidth;
            targetHeight = targetWidth * imgProp;
        }

        img.style.width = `${Math.floor(targetWidth)}px`;
        img.style.height = `${Math.floor(targetHeight)}px`;
    }
    componentDidMount() {
        window.addEventListener("resize", this.resizeImageToFill);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeImageToFill);
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
            <div id="welcome-page">
                <img
                    id="background-image"
                    src={backgroundImage}
                    onLoad={this.resizeImageToFill}
                    alt="background"></img>
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
                                            {/* <span className="icon is-small is-left">
                                                <i className="fa material-icons">face</i>
                                            </span> */}
                                        </p>
                                    </div>
                                    <div className="field">
                                        <p className="control">
                                            <button
                                                className="button is-success"
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
            </div>
        );
    }
}

WelcomePage.propTypes = {
    history: PropTypes.object,
};

export default withRouter(WelcomePage);
