import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import * as backgroundImage from "../assets/background-image.jpg";
import "./WelcomePage.scss";
import axios from "axios";
class WelcomePage extends Component {
    propTypes = {
        history: null,
    };
    // const img = new Image();
    // img.onload = function() {
    //     const root = document.getElementById("root");
    //     const pageProp = root.clientHeight / root.clientWidth;
    //     const imgProp = this.imageW
    // };

    constructor(props) {
        super(props);
        this.state = {pseudo: ""};
    }

    onLogin = () => {
        axios
            .post(process.env.REACT_APP_DEV_HTTP_API + "/user?pseudo=" + this.state.pseudo)
            .then((response) => {
                this.props.history.push({pathname: "/lounge", state: {detail: response.data}});
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    handleChange = (event) => {
        this.setState({pseudo: event.target.value});
    };

    render() {
        return (
            <div id="welcome-page" className="container">
                <img id="background-image" src={backgroundImage} alt="background"></img>
                <div className="box">
                    <p className="title is-1">Welcome on PaperBoard !</p>
                    <p className="subtitle is-4">Don't think to much, draw it !</p>
                </div>
                <div className="box">
                    <div className="field">
                        <p className="control has-icons-left">
                            <input
                                type="text"
                                className="input"
                                placeholder="Pseudo"
                                value={this.state.value}
                                onChange={this.handleChange}></input>
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button is-success" onClick={this.onLogin}>
                                Login
                            </button>
                        </p>
                    </div>
                    <Link to="/lounge">Go to Lounge page</Link> youpi.
                </div>
            </div>
        );
    }
}

export default withRouter(WelcomePage);
