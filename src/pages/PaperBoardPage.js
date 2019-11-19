import React, {Component} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
    TextFields as TextFieldIcon,
    Photo,
    Maximize,
    CropLandscape,
    Edit,
    PanoramaFishEye,
} from "@material-ui/icons";
import {getCanvasSize} from "../utils/resize";
import Background from "../components/Background";
import {ExitToApp, SaveAlt, CloudUpload, Message as MessageIcon} from "@material-ui/icons";
import Chat from "../components/Chat";
import TextField from "@material-ui/core/TextField";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import Message from "../components/Message";
import ListOfUsers from "../components/ListOfUsers";
import Canvas from "../components/Canvas";
import ShapePanel from "../components/ShapePanel";
import Toast from "light-toast";

const color = require("string-to-color");

const sideList = (createTextField, createCircle) => (
    <div style={{maxWidth: 360, backgroundColor: "white"}}>
        <List component="nav" aria-label="main mailbox folders">
            <ListItem button key={"Text"} onClick={createTextField}>
                <ListItemIcon>
                    <TextFieldIcon />
                </ListItemIcon>
                <ListItemText primary={"Text"} />
            </ListItem>
        </List>
        <Divider />
        <List>
            {[
                {title: "Line", component: <Maximize />},
                {title: "Rectangle", component: <CropLandscape />},
                {title: "Circle", component: <PanoramaFishEye />, method: createCircle},
                {title: "Edit", component: <Edit />},
            ].map((item) => (
                <ListItem button key={item.title} onClick={item.method}>
                    <ListItemIcon>{item.component}</ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItem>
            ))}
        </List>
        <Divider />
        <List>
            <ListItem button key={"Picture"}>
                <ListItemIcon>
                    <Photo />
                </ListItemIcon>
                <ListItemText primary={"Picture"} />
            </ListItem>
        </List>
    </div>
);

class PaperBoardPage extends Component {
    constructor(props) {
        super(props);
        // const {
        //     location: {
        //         state: {paperboard, pseudo, drawers},
        //     },
        // } = props;
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.state = {
            paperboard: {title: "lol"},
            pseudo: "",
            width: 0,
            height: 0,
            isChatDisplayed: false,
            textFieldValue: "",
            messages: [],
            drawers: [],
            isShapePanelToggeled: false,
        };
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.CHAT_MESSAGE,
            this.receiveMessage,
            this
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_LEFT_BOARD,
            (leaver, drawers) => {
                this.setState({drawers});
                const {pseudo} = this.state;
                if (pseudo === leaver) {
                    this.props.history.push({pathname: "/lounge", state: {pseudo}});
                }
            },
            this
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            (drawers) => {
                this.setState({drawers});
            },
            this
        );

        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_DISCONNECTED,
            this.handleDrawerDisconnected,
            this
        );
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.CHAT_MESSAGE,
            this.receiveMessage,
            this
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_LEFT_BOARD,
            (leaver, drawers) => {
                this.setState({drawers});
                const {pseudo} = this.state;
                if (pseudo === leaver) {
                    this.props.history.push({pathname: "/lounge", state: {pseudo}});
                }
            },
            this
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            (drawers) => {
                this.setState({drawers});
            },
            this
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_DISCONNECTED,
            this.handleDrawerDisconnected,
            this
        );
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    onSave = () => {
        alert("TODO SAVE");
        // TODO
    };

    onQuit = () => {
        const {pseudo} = this.state;
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.LEAVE_BOARD,
            from: pseudo,
            to: "server",
            payload: {},
        });
    };

    onImport = () => {
        alert("TODO IMPORT");
        // TODO
    };

    onChat = () => {
        this.setState((prevState) => ({
            isChatDisplayed: !prevState.isChatDisplayed,
        }));
    };

    _handleTextFieldChange = (e) => {
        if (e.key === "Enter") {
            this.sendMessage();
        }
        this.setState({
            textFieldValue: e.target.value,
        });
    };

    sendMessage = () => {
        const {
            location: {
                state: {pseudo},
            },
        } = this.props;
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.CHAT_MESSAGE,
            from: pseudo,
            to: "server",
            payload: {
                msg: this.state.textFieldValue,
            },
        });
        this.setState({textFieldValue: ""});
    };

    receiveMessage = (writer, msg) => {
        const {
            location: {
                state: {pseudo},
            },
        } = this.props;
        const {messages} = this.state;
        messages.push(
            <Message
                key={messages.length}
                color={color(writer)}
                name={writer}
                message={msg}
                isAuthor={writer === pseudo}
            />
        );
        this.setState({
            messages,
        });
    };

    catchReturn = (e) => {
        if (e.key === "Enter") {
            this.sendMessage();
        }
    };

    createTextField = () => {
        // TODO
        alert("create text field");
    };

    createCircle = () => {
        this.canvas.createCircle();
    };

    editCircle = () => {
        this.canvas.editShape();
    };

    toggleShapePanel = () => {
        this.setState((prevState) => ({
            isShapePanelToggeled: !prevState.isShapePanelToggeled,
        }));
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
        const {width, height, isChatDisplayed, messages, textFieldValue} = this.state;

        const {paperboard, drawers, isShapePanelToggeled} = this.state;
        const {canvasWidth, canvasHeight} = getCanvasSize((height * 9) / 10, width);
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "space-between",
                        justifyContent: "space-between",
                        flex: "1",
                        height: (height * 9) / 10,
                        backgroundColor: "#a8caff",
                    }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            color: "black",
                            marginLeft: 15,
                            fontWeight: "bold",
                        }}>
                        {paperboard && `Paperboard : ${paperboard.title.toString().toUpperCase()}`}
                    </div>
                    <ListOfUsers users={drawers} />
                    <div>
                        <Button onClick={this.onImport}>
                            <CloudUpload />
                        </Button>
                        <Button onClick={this.onSave}>
                            <SaveAlt />
                        </Button>
                        <Button onClick={this.onQuit}>
                            <ExitToApp />
                        </Button>
                    </div>
                </div>
                <Background>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flex: "1",
                        }}>
                        {sideList(this.createTextField, this.createCircle)}
                        <Canvas
                            ref={(el) => (this.canvas = el)}
                            width={canvasWidth}
                            height={canvasHeight}
                            toggleShapePanel={this.toggleShapePanel}
                        />
                        {isShapePanelToggeled && <ShapePanel editCircle={this.editCircle} />}
                    </div>
                </Background>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        position: "absolute",
                        bottom: 50,
                        right: 50,
                    }}>
                    {isChatDisplayed && (
                        <Chat height={height / 3} onCloseChat={this.onChat} messages={messages} />
                    )}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                        {isChatDisplayed && (
                            <div style={{paddingRight: width / 50}}>
                                <TextField
                                    id="outlined-basic"
                                    label="Message"
                                    margin="normal"
                                    variant="outlined"
                                    style={{backgroundColor: "white", borderRadius: 5}}
                                    onChange={this._handleTextFieldChange}
                                    onKeyPress={this.catchReturn}
                                    value={textFieldValue}
                                />
                            </div>
                        )}
                        <div
                            onClick={() => (isChatDisplayed ? this.sendMessage() : this.onChat())}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "white",
                                width: isChatDisplayed ? 50 : 100,
                                height: isChatDisplayed ? 50 : 100,
                                borderRadius: isChatDisplayed ? 25 : 50,
                                boxShadow: "6px 6px 6px #9E9E9E",
                                shadowOpacity: 0.5,
                            }}>
                            <MessageIcon
                                style={{
                                    width: isChatDisplayed ? 20 : 60,
                                    height: isChatDisplayed ? 20 : 60,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PaperBoardPage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(PaperBoardPage);
