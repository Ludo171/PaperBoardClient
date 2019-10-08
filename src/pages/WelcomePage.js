import React from "react";
import {Link} from "react-router-dom";

export default function WelcomePage() {
    return (
        <div className="container">
            <h1>Welcome Page</h1>
            <p>
                <Link to="/lounge">Go to Lounge page</Link> youpi.
            </p>
        </div>
    );
}
