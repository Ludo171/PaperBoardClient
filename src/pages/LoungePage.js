import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {getAllPaperBoards, getPaperBoard} from "../services/paperboards";
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

    goToPaperBoard = (title) => {
        getPaperBoard(title)
            .then((response) => {
                this.props.history.push({
                    pathname: "/paperboard",
                    state: {paperboard: response.data},
                });
                console.log(response.data);
            })
            .catch(function(error) {
                alert(error);
            });
    };

    render() {
        const {pseudo, paperboards} = this.state;

        const list = paperboards.map((paperboard, index) => (
            <div
                key={index}
                className="list-item"
                onClick={() => this.goToPaperBoard(paperboard.title)}>
                <div>
                    <p>{paperboard.title}</p>
                    <p>{"Number of drawers : " + paperboard.numberOfConnectedUser}</p>
                </div>
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
