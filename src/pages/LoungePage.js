import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {getAllPaperBoards, getPaperBoard} from "../services/paperboards";
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
    state = {
        pseudo: "must auth",
        paperboards: [],
        chosenPaperboard: null,
    };

    defaultBoardTitle = "default-paper-board";

    constructor(props) {
        super(props);
        this.getAllPaperBoards();
        this.loopGetAllPaperBoards();
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

    getAllPaperBoards = () => {
        getAllPaperBoards()
            .then((response) => {
                this.setState({paperboards: response.data});
            })
            .catch(function(error) {
                alert("getAllPaperBoards" + error);
            });
    };

    loopGetAllPaperBoards = () => {
        setTimeout(() => {
            this.getAllPaperBoards();
            this.loopGetAllPaperBoards();
        }, 30000);
    };

    onCreatePaperBoard = () => {
        this.props.history.push({pathname: "/new-board", state: {pseudo: this.state.pseudo}});
    };

    goToPaperBoard = (title) => {
        getPaperBoard(title)
            .then((response) => {
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
                        fontSize: 80,
                        marginBottom: 25,
                        color: "white",
                    }}>
                    {`${pseudo} choose your place of inspiration`}
                </h1>
                <div className="card">
                    <div className="card-content">
                        <div className="title is-1">
                            <h1>{"Join a Board"}</h1>
                        </div>
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
