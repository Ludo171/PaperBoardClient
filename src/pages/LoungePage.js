import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {getAllPaperBoards} from "../services/paperboards";
import PropTypes from "prop-types";
import "./LoungePage.scss";

class LoungePage extends Component {
    state = {
        pseudo: "must auth",
        paperboards: [],
    };

    defaultBoardTitle = "default-paper-board";

    constructor(props) {
        super(props);
        getAllPaperBoards()
            .then((response) => {
                this.setState({paperboards: response.data});
            })
            .catch(function(error) {
                alert(error);
            });
    }

    componentDidMount() {
        if (this.props.location && this.props.location.state) {
            const {
                location: {
                    state: {
                        detail: {pseudo},
                    },
                },
            } = this.props;
            this.setState({pseudo});
        }
    }

    onCreatePaperBoard = () => {
        this.props.history.push({pathname: "/new-board"});
    };

    render() {
        const {pseudo, paperboards} = this.state;

        const list = paperboards.map((paperboard, index) => (
            <div key={index}>
                <Link className="list-item" to={"/paperboard/" + paperboard.title} key={index}>
                    <p>{paperboard.title}</p>
                    <p>{"Nomber of drawers : " + paperboard.numberOfConnectedUser}</p>
                </Link>
                <hr className="dropdown-divider"></hr>
            </div>
        ));
        return (
            <div className="container">
                <div className="title is-3 has-text-success">
                    <h1>{"Hi " + pseudo + " !"}</h1>
                </div>
                <div className="field">
                    <p className="control">
                        <button className="button is-success" onClick={this.onCreatePaperBoard}>
                            Create a new Paperboard
                        </button>
                    </p>
                </div>
                <div className="title is-3 has-text-success">
                    <h1>{"Join a paperboard :"}</h1>
                </div>
                <div className="paperboard-list">
                    <div className="list is-hoverable">{list}</div>
                </div>
            </div>
        );
    }
}

LoungePage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(LoungePage);
