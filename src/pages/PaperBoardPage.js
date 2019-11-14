import React, {Component} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
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
import {ExitToApp, Menu, SaveAlt, CloudUpload, Message} from "@material-ui/icons";
import Chat from "../components/Chat";
import TextField from "@material-ui/core/TextField";
import {downloadBgImage} from "../services/paperboards";
const FileSaver = require("file-saver");

const sideList = (side, toggleDrawer) => (
    <div
        className={"list"}
        role="presentation"
        onClick={toggleDrawer(side, false)}
        onKeyDown={toggleDrawer(side, false)}>
        <List>
            <ListItem button key={"Text"}>
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
                {title: "Circle", component: <PanoramaFishEye />},
                {title: "Edit", component: <Edit />},
            ].map((item) => (
                <ListItem button key={item.title}>
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
    state = {
        left: false,
        width: 0,
        height: 0,
        isChatDisplayed: false,
        textFieldValue: "",
        image: null,
    };

    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        const {
            location: {
                state: {
                    paperboard: {title},
                },
            },
        } = this.props;
        downloadBgImage(title).then((res) => {
            console.log(res);
            // blob = new Blob([blob], {type: 'image/png'})
            const url = window.URL.createObjectURL(new Blob([res.data], {type: "image/jpg"}));
            console.log(url);
            // FileSaver.saveAs(res.data, "hry.jpg");
            this.setState({image: url, bytes: res.data});
        });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    toggleDrawer = (side, open) => (event) => {
        if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }

        this.setState({[side]: open});
    };

    onSave = () => {
        alert("TODO SAVE");
        // TODO
    };

    onQuit = () => {
        this.props.history.push({pathname: "/lounge"});
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
            // Do code here
            alert("enter is hit");
        }
        this.setState({
            textFieldValue: e.target.value,
        });
    };

    sendMessage = () => {
        // TODO
        alert(this.state.textFieldValue);
    };

    catchReturn = (e) => {
        if (e.key === "Enter") {
            this.sendMessage();
        }
    };

    render() {
        const {
            location: {
                state: {paperboard},
            },
        } = this.props;
        console.log(paperboard);
        const {left, width, height, isChatDisplayed, image} = this.state;

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
                    <Button onClick={this.toggleDrawer("left", true)}>
                        <Menu />
                    </Button>
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
                <SwipeableDrawer
                    open={left}
                    onClose={this.toggleDrawer("left", false)}
                    onOpen={this.toggleDrawer("left", true)}>
                    {sideList("left", this.toggleDrawer)}
                </SwipeableDrawer>
                <Background>
                    <div
                        style={{
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            flex: "1",
                        }}>
                        <canvas
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                            }}></canvas>
                    </div>
                </Background>
                <img src={image} />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        position: "absolute",
                        bottom: 50,
                        right: 50,
                    }}>
                    {isChatDisplayed && <Chat height={height / 3} onCloseChat={this.onChat} />}
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
                            <Message
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
