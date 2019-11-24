import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import "./LoungePage.scss";
import Background from "../components/Background";
import MaterialTable from "material-table";
import * as moment from "moment";
import * as backgroundImage from "../assets/wood.jpg";
import {Refresh} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
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
    constructor(props) {
        super(props);
        this.componentName = "LoungePage";

        this.timeouts = [];

        this.state = {
            pseudo: "must auth",
            paperboards: [],
            chosenPaperboard: null,
        };
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
        if (this.props.location && this.props.location.state) {
            const {
                location: {
                    state: {pseudo},
                },
            } = this.props;
            this.setState({pseudo});
        }
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.ANSWER_GET_ALL_BOARDS,
            this.handleAnswerGetAllBoards,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.ANSWER_GET_BOARD,
            this.handleAnswerGetBoard,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleJoinBoardServerResponse,
            this.componentName
        );
        this.getAllPaperBoards();
        this.loopGetAllPaperBoards();
        console.log("Lounge Page component did Mount");
        console.log(this.state);
    }

    componentWillUnmount() {
        console.log("Lounge Page component will unMount");
        console.log(this.state);
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleJoinBoardServerResponse,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.ANSWER_GET_BOARD,
            this.handleAnswerGetBoard,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleJoinBoardServerResponse,
            this.componentName
        );

        while (this.timeouts.length > 0) {
            const t = this.timeouts.pop();
            clearTimeout(t);
        }
        this._mounted = false;
    }

    getAllPaperBoards = () => {
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.GET_ALL_BOARDS,
            from: this.state.pseudo,
            to: "server",
            payload: {},
        });
    };
    handleAnswerGetAllBoards = (data) => {
        if (this._mounted) {
            this.setState({paperboards: data.paperboards});
        }
    };

    loopGetAllPaperBoards = () => {
        this.timeouts.push(
            setTimeout(() => {
                this.getAllPaperBoards();
                this.loopGetAllPaperBoards();
            }, 30000)
        );
    };

    onCreatePaperBoard = () => {
        this.props.history.push({pathname: "/new-board", state: {pseudo: this.state.pseudo}});
    };

    goToPaperBoard = (title) => {
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.GET_BOARD,
            from: this.state.pseudo,
            to: "server",
            payload: {title},
        });
    };

    handleAnswerGetBoard = (data) => {
        this.setState({chosenPaperboard: data.paperboard}, () => {
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.JOIN_BOARD,
                from: this.state.pseudo,
                to: "server",
                payload: {board: data.paperboard.title},
            });
        });
    };

    handleJoinBoardServerResponse = (drawers) => {
        const {pseudo, chosenPaperboard} = this.state;
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
            paperboard.drawers = paperboard.drawers.length;
            return paperboard;
        });
        return (
            <Background
                customStyle={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                imgSrc={backgroundImage}>
                <h1
                    style={{
                        fontWeight: "bold",
                        fontSize: "3em",
                        marginBottom: 5,
                        color: "white",
                        textAlign: "center",
                    }}>
                    {`${pseudo.charAt(0).toUpperCase()}${pseudo.substring(
                        1
                    )}, find your place of inspiration !`}
                </h1>
                <div className="card" style={{borderRadius: "10px"}}>
                    <div className="card-content">
                        <p className="title is-1" style={{textAlign: "center"}}>
                            Join a Board
                        </p>
                        <MaterialTable
                            title={
                                <div
                                    style={{
                                        display: "flex",
                                        flex: 1,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                    Boards
                                    <IconButton
                                        onClick={this.getAllPaperBoards}
                                        style={{marginLeft: 30}}>
                                        <Refresh />
                                    </IconButton>
                                </div>
                            }
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
                <div className="field" style={{marginTop: 15}}>
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
