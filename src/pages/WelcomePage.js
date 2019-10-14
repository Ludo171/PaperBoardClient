import React from "react";
import {Link} from "react-router-dom";
import * as backgroundImage from "../assets/background-image1.jpg";
import "./WelcomePage.scss";

export default class WelcomePage extends React.Component {
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

    render() {
        return (
            <div id="welcome-page">
                <img
                    id="background-image"
                    src={backgroundImage}
                    onLoad={this.resizeImageToFill}
                    alt="background"></img>
                <div className="box">
                    <p className="title is-1">Welcome on PaperBoard !</p>
                    <p className="subtitle is-4">Don't think to much, draw it !</p>
                </div>
                <div className="box">
                    <div className="field">
                        <p className="control has-icons-left">
                            <input className="input" type="password" placeholder="Password"></input>
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button is-success">Login</button>
                        </p>
                    </div>
                    <Link to="/lounge">Go to Lounge page</Link> youpi.
                </div>
            </div>
        );
    }
}
