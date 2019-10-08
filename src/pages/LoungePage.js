import React from "react";
import {Link} from "react-router-dom";

export default function LoungePage() {
    const defaultBoardTitle = "default-paper-board";
    return (
        <div className="container">
            <h1>Lounge Page</h1>
            <p>
                <Link to="/new-board">Go to Create Board page</Link> youpihou.
                <Link to={"/paperboard/" + defaultBoardTitle}>Go to Default PaperBoard page</Link>
                youpioulalala.
            </p>
        </div>
    );
}
