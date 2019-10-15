import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {createPaperBoard} from "../services/paperboards";
import PropTypes from "prop-types";
import {colors} from "../utils/colors";
import "./LoungePage.scss";

const getColorList = (handleColor) => {
    const list = [];
    // eslint-disable-next-line guard-for-in
    for (const color in colors) {
        list.push(
            <div
                className="dropdown-item"
                key={colors[color]}
                onClick={() => handleColor(color, colors[color])}>
                <div className="dropdown-item-text">
                    <p style={{color: colors[color]}}>&#9632;</p>
                    <p>{color}</p>
                </div>
                <hr className="dropdown-divider"></hr>
            </div>
        );
    }
    return list;
};

class CreateBoardPage extends Component {
    state = {
        title: "",
        color: "",
        hexColorCode: "",
    };

    defaultBoardTitle = "default-paper-board";

    constructor(props) {
        super(props);
    }

    handleTitleChanges = (event) => {
        this.setState({title: event.target.value});
    };

    handleColor = (color, hexColorCode) => {
        this.setState({color, hexColorCode});
    };

    onCreatePaperBoard = () => {
        const {title, color} = this.state;
        createPaperBoard(title, color)
            .then((response) => {
                this.props.history.push({
                    pathname: "/paperboard/" + response.data.title,
                    state: {detail: response.data},
                });
            })
            .catch(function(error) {
                if (error.response.status === 409) {
                    alert(
                        "A board with the name " +
                            title +
                            " already exists. Plesae consider another name"
                    );
                }
            });
    };

    render() {
        const {color, hexColorCode} = this.state;
        return (
            <div className="container">
                <div className="title is-1 has-text-success">
                    <h1>Set up your board and create it !</h1>
                </div>
                <div className="paperboard-form">
                    <div className="field">
                        <p className="control has-icons-left">
                            <input
                                type="text"
                                className="input"
                                placeholder="Title - required"
                                value={this.state.title}
                                onChange={this.handleTitleChanges}></input>
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="dropdown">
                        <div className="dropdown is-hoverable">
                            <div className="dropdown-trigger">
                                <button
                                    className="button"
                                    aria-haspopup="true"
                                    aria-controls="dropdown-menu4">
                                    <p style={{color: hexColorCode, marginRight: "5%"}}>&#9632;</p>
                                    <span>{color ? color : "Background color"}</span>
                                </button>
                            </div>
                            <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                                <div className="dropdown-content">
                                    {getColorList(this.handleColor)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button is-success" onClick={this.onCreatePaperBoard}>
                                Create Paperboard
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

CreateBoardPage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(CreateBoardPage);
