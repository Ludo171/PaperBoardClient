import React from "react";
import {Link} from "react-router-dom";

export default function PaperBoardPage() {
    return (
        <div className="container">
            <h1>Default PaperBoard Page</h1>
            <p>
                <Link to="/lounge">Back to Lounge page</Link> oooohhh....
            </p>
        </div>
    );
}
