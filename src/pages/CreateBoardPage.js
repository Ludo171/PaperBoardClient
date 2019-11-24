import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {createPaperBoard} from "../services/paperboards";
import PropTypes from "prop-types";
import "./CreateBoardPage.scss";
import Background from "../components/Background";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import * as backgroundImage from "../assets/Wood-4.jpg";
import ColorPicker from "../components/ColorPicker";
import {colors} from "../utils/colors";

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
    }

    defaultBoardTitle = "default-paper-board";

    handleTitleChanges = (event) => {
        this.setState({title: event.target.value});
    };

    handleColor = (response) => {
        const {item: color, value: hexColorCode} = response;
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
            <Background
                customStyle={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                imgSrc={backgroundImage}>
                <div className="card" style={{borderRadius: "10px"}}>
                    <div className="card-content">
                        <p className="title is-1" style={{textAlign: "center"}}>
                            Set up your board and create it !
                        </p>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input
                                    type="text"
                                    className="input is-large is-success"
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
                                <ColorPicker
                                    color={color}
                                    hexColorCode={hexColorCode}
                                    handleClick={this.handleColor}
                                    listField={colors}
                                    field={"Background color"}
                                    type={"color"}
                                />
                            ) : null}
                            {isBackgroundImage ? <div>todo</div> : null}
                        </div>
                    </div>
                </div>
                <div className="field" style={{marginTop: 15}}>
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
