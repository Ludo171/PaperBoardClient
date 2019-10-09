import React from "react";
import {Link} from "react-router-dom";
import * as backgroundImage from '../assets/background-image.jpg';
import "./WelcomePage.scss";

export default function WelcomePage() {

    // const img = new Image();
    // img.onload = function() {
    //     const root = document.getElementById("root");
    //     const pageProp = root.clientHeight / root.clientWidth;
    //     const imgProp = this.imageW
    // };

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
