import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {getAllPaperBoards, getPaperBoard} from "../services/paperboards";
import PropTypes from "prop-types";
import "./LoungePage.scss";
import Background from "../components/Background";
import MaterialTable from "material-table";
import * as moment from "moment";
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
    };

    defaultBoardTitle = "default-paper-board";

    constructor(props) {
        super(props);
        getAllPaperBoards()
            .then((response) => {
                this.setState({paperboards: response.data});
                console.log(response.data);
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
        paperboards.map((paperboard) => {
            paperboard.creationDate = moment(paperboard.creationDate).format(
                "dddd, MMMM Do YYYY, h:mm:ss a"
            );
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
