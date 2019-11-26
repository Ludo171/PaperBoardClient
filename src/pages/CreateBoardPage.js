import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import "./CreateBoardPage.scss";
import Background from "./Background";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import * as backgroundImage from "../assets/Wood-4.jpg";
import ColorPicker from "../components/Picker";
import {colors} from "../utils/colors";
import {getBase64} from "../utils/readAsDataUrl";
import {Button} from "@material-ui/core";
import config from "../config/config";

class CreateBoardPage extends Component {
    constructor(props) {
        super(props);
        this.componentName = "CreateBoardPage";
        this.state = {
            title: "",
            color: "",
            hexColorCode: "",
            isBackgroundColor: false,
            isBackgroundImage: false,
            paperboard: null,
            pseudo: "",
            imageDataUrl: "",
        };
    }

    componentDidMount = () => {
        const {
            location: {state},
        } = this.props;
        this.setState({pseudo: state ? state.pseudo : ""});
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.ANSWER_CREATE_BOARD,
            this.handleAnswerCreateBoard,
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
    };

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.ANSWER_CREATE_BOARD,
            this.handleAnswerCreateBoard,
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
        const {title} = this.state;
        if (title !== "") {
            const payload = {title};
            if (this.state.isBackgroundImage && this.state.imageDataUrl !== "") {
                payload.backgroundImage = this.state.imageDataUrl;
            } else if (this.state.isBackgroundColor && this.state.hexColorCode !== "") {
                payload.backgroundColor = this.state.hexColorCode;
            }
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.CREATE_BOARD,
                from: this.state.pseudo,
                to: "server",
                payload,
            });
        }
    };

    handleAnswerCreateBoard = (data) => {
        const {title} = this.state;
        if (data.created === true) {
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.GET_BOARD,
                from: this.state.pseudo,
                to: "server",
                payload: {title},
            });
        } else {
            alert(
                "A board with the name " + title + " already exists. Plesae consider another name"
            );
        }
    };

    handleAnswerGetBoard = (data) => {
        this.setState({paperboard: data.paperboard}, () => {
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.JOIN_BOARD,
                from: this.state.pseudo,
                to: "server",
                payload: {board: data.paperboard.title},
            });
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
            });
        } else {
            this.setState({
                isBackgroundColor: false,
                isBackgroundImage: event.target.checked,
            });
        }
        this.setState({color: "", hexColorCode: ""});
    };

    handleImage = (files) => {
        const maxSize = ["dev", "develop", "development"].includes(config.environment)
            ? 42000
            : 1300;
        const typesAllowed = ["image/png", "image/jpeg", "image/jpg"];
        const file = document.getElementById("browseBackgroundImage").files[0];
        if (file === undefined) {
            return;
        } else if (!typesAllowed.includes(file.type)) {
            alert(`Bad File Type [${file.type}]. File type should be among [png, jpeg, jpg].`);
            return;
        } else if (file.size > maxSize) {
            alert(`File size should not exceed ${maxSize / 1000}ko.`);
            return;
        }
        getBase64(file).then((imageData) => {
            this.setState({imageDataUrl: imageData});
        });
    };

    render() {
        const {color, hexColorCode, isBackgroundColor, isBackgroundImage} = this.state;
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
                            {isBackgroundImage ? (
                                // <DropzoneArea onChange={this.handleImage} />
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        const myInput = document.getElementById(
                                            "browseBackgroundImage"
                                        );
                                        if (myInput) {
                                            myInput.click();
                                        }
                                    }}>
                                    Browse image
                                </Button>
                            ) : null}
                            <input
                                type="file"
                                id="browseBackgroundImage"
                                style={{position: "fixed", bottom: "10000px"}}
                                onChange={() => this.handleImage()}></input>
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
