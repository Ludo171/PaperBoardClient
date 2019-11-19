import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {getAllPaperBoards, getPaperBoard} from "../services/paperboards";
import PropTypes from "prop-types";
import "./LoungePage.scss";
import Background from "../components/Background";
import MaterialTable from "material-table";
import * as moment from "moment";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
const columns = [
    {
        title: "Title",
        field: "title",
    },
    {
        title: "Nb of participants",
        field: "numberOfConnectedUser",
    },
    {
        title: "Creation date",
        field: "creationDate",
    },
];

class LoungePage extends Component {
    state = {
        pseudo: "must auth",
        paperboards: [],
        chosenPaperboard: null,
    };

    defaultBoardTitle = "default-paper-board";

    constructor(props) {
        super(props);
        getAllPaperBoards()
            .then((response) => {
                this.setState({paperboards: response.data});
            })
            .catch(function(error) {
                alert("getAllPaperBoards" + error);
            });
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleJoinBoardServerResponse,
            this
        );
    }

    componentDidMount() {
        if (this.props.location && this.props.location.state) {
            const {
                location: {
                    state: {pseudo},
                },
            } = this.props;
            this.setState({pseudo});
        }
    }

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleJoinBoardServerResponse,
            this
        );
    }

    onCreatePaperBoard = () => {
        this.props.history.push({pathname: "/new-board", state: {pseudo: this.state.pseudo}});
    };

    goToPaperBoard = (title) => {
        console.log(title);
        getPaperBoard(title)
            .then((response) => {
                console.log(response.data);
                this.setState({chosenPaperboard: response.data}, () => {
                    socketClientInstance.sendMessage({
                        type: constants.SOCKET_MSG.JOIN_BOARD,
                        from: this.state.pseudo,
                        to: "server",
                        payload: {board: title},
                    });
                });
            })
            .catch(function(error) {
                alert(error);
            });
    };

    handleJoinBoardServerResponse = (drawers) => {
        const {pseudo, chosenPaperboard} = this.state;
        console.log(chosenPaperboard);
        if (chosenPaperboard) {
            this.props.history.push({
                pathname: `/paperboard/${chosenPaperboard.title}`,
                state: {paperboard: chosenPaperboard, pseudo, drawers},
            });
        }
    };

    render() {
        const {pseudo, paperboards} = this.state;
        paperboards.map((paperboard) => {
            paperboard.creationDate = moment(paperboard.creationDate).format(
                "dddd, MMMM Do YYYY, h:mm:ss a"
            );
            return paperboard;
        });
        return (
            <Background>
                <div className="card">
                    <div className="card-content">
                        <div className="title is-3">
                            <h1>{"Hi " + pseudo + " !"}</h1>
                        </div>
                        <div className="title is-1">
                            <h1>{"Join a Board"}</h1>
                        </div>
                        <MaterialTable
                            title="Boards"
                            columns={columns}
                            data={paperboards}
                            actions={[
                                {
                                    title: "Join",
                                    icon: "create",
                                    tooltip: "Join",
                                    onClick: (event, rowData) => this.goToPaperBoard(rowData.title),
                                },
                            ]}
                        />
                    </div>
                </div>
                <div className="field">
                    <p className="control">
                        <button
                            className="button is-success is-large"
                            onClick={this.onCreatePaperBoard}>
                            Create a new Paperboard
                        </button>
                    </p>
                </div>
            </Background>
        );
    }
}

LoungePage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(LoungePage);
