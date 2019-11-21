import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {createPaperBoard} from "../services/paperboards";
import PropTypes from "prop-types";
import {colors} from "../utils/colors";
import "./CreateBoardPage.scss";
import Background from "../components/Background";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import Toast from "light-toast";
import * as backgroundImage from "../assets/background-image2.jpg";

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
        isBackgroundColor: false,
        isBackgroundImage: false,
        isSwitchBgColorDisabled: false,
        isSwitchBgImageDisabled: false,
        paperboard: null,
        pseudo: "",
    };

    constructor(props) {
        super(props);

        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleJoinBoardServerResponse,
            this
        );

        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_DISCONNECTED,
            this.handleDrawerDisconnected,
            this
        );
    }

    componentDidMount = () => {
        const {
            location: {state},
        } = this.props;
        this.setState({pseudo: state ? state.pseudo : ""});
    };

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleJoinBoardServerResponse,
            this
        );

        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_DISCONNECTED,
            this.handleDrawerDisconnected,
            this
        );
    }

    defaultBoardTitle = "default-paper-board";

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
                this.setState({paperboard: response.data}, () => {
                    socketClientInstance.sendMessage({
                        type: constants.SOCKET_MSG.JOIN_BOARD,
                        from: this.state.pseudo,
                        to: "server",
                        payload: {board: title},
                    });
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

    handleJoinBoardServerResponse = (drawers) => {
        const {pseudo, paperboard} = this.state;
        this.props.history.push({
            pathname: `/paperboard/${paperboard.title}`,
            state: {paperboard, pseudo, drawers},
        });
    };

    handleSwitch = (name) => (event) => {
        if (name === "bgColor") {
            this.setState({
                isBackgroundColor: event.target.checked,
                isBackgroundImage: false,
                isSwitchBgColorDisabled: false,
                isSwitchBgImageDisabled: event.target.checked,
            });
        } else {
            this.setState({
                isBackgroundColor: false,
                isBackgroundImage: event.target.checked,
                isSwitchBgColorDisabled: event.target.checked,
                isSwitchBgImageDisabled: false,
            });
        }
        this.setState({color: "", hexColorCode: ""});
    };

    handleDrawerDisconnected = () => {
        Toast.fail(
            "You have been disconnected from server, you will be redirected to login page",
            3000,
            () => {}
        );
        setTimeout(() => {
            this.props.history.push({
                pathname: "/",
            });
            Toast.hide();
        }, 3000);
    };

    render() {
        const {
            color,
            hexColorCode,
            isBackgroundColor,
            isSwitchBgImageDisabled,
            isSwitchBgColorDisabled,
            isBackgroundImage,
        } = this.state;
        return (
            <Background imgSrc={backgroundImage}>
                <div className="title is-1 has-text-success">
                    <h1>Set up your board and create it !</h1>
                </div>
                <div className="card">
                    <div className="card-content">
                        <div className="field">
                            <p className="control has-icons-left">
                                <input
                                    type="text"
                                    className="input is-large"
                                    placeholder="Title - required"
                                    value={this.state.title}
                                    onChange={this.handleTitleChanges}></input>

                                <span className="icon is-small is-left">
                                    <i className="fas fa-lock"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isBackgroundColor}
                                            onChange={this.handleSwitch("bgColor")}
                                            value="checkedA"
                                        />
                                    }
                                    disabled={isSwitchBgColorDisabled}
                                    label="Background Color"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isBackgroundImage}
                                            onChange={this.handleSwitch("bgImage")}
                                            value="checkedB"
                                            color="primary"
                                        />
                                    }
                                    disabled={isSwitchBgImageDisabled}
                                    label="Background Image"
                                />
                            </FormGroup>
                        </div>
                        <div className="empty-div">
                            {isBackgroundColor ? (
                                <div className="dropdown">
                                    <div className="dropdown is-hoverable">
                                        <div className="dropdown-trigger">
                                            <button
                                                className="button"
                                                aria-haspopup="true"
                                                aria-controls="dropdown-menu4">
                                                <p
                                                    style={{
                                                        color: hexColorCode,
                                                        marginRight: "5%",
                                                    }}>
                                                    &#9632;
                                                </p>
                                                <span>{color ? color : "Background color"}</span>
                                            </button>
                                        </div>
                                        <div
                                            className="dropdown-menu"
                                            id="dropdown-menu4"
                                            role="menu">
                                            <div className="dropdown-content">
                                                {getColorList(this.handleColor)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            {isBackgroundImage ? <div>todo</div> : null}
                        </div>
                    </div>
                </div>
                <div className="field">
                    <p className="control">
                        <button
                            className="button is-success is-large"
                            onClick={this.onCreatePaperBoard}>
                            Create !
                        </button>
                    </p>
                </div>
            </Background>
        );
    }
}

CreateBoardPage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(CreateBoardPage);
