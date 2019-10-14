import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";

class LoungePage extends Component {
    propTypes = {
        history: null,
        location: null,
    };
    defaultBoardTitle = "default-paper-board";
    constructor(props) {
        super(props);
    }
    render() {
        const {
            location: {
                state: {
                    detail: {pseudo},
                },
            },
        } = this.props;
        return (
            <div className="container">
                <h1>{"Lounge Page of " + pseudo}</h1>
                <p>
                    <Link to="/new-board">Go to Create Board page</Link> youpihou.
                    <Link to={"/paperboard/" + this.defaultBoardTitle}>
                        Go to Default PaperBoard page
                    </Link>
                    youpioulalala.
                </p>
            </div>
        );
    }
}

export default withRouter(LoungePage);
