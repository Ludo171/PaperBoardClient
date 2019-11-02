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
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import {getCanvasSize} from "../utils/resize";
import Background from "../components/Background";
import {ExitToApp, Menu, SaveAlt, CloudUpload, Message} from "@material-ui/icons";
import Chat from "../components/Chat";
import TextField from "@material-ui/core/TextField";

const mocked = {
    drawers: [{pseudo: "pat"}, {pseudo: "gégé"}],
};

class PaperBoardPage extends Component {
    state = {
        left: false,
        width: 0,
        height: 0,
        isChatDisplayed: false,
    };

    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
        console.log("chat");
        this.setState((prevState) => ({
            isChatDisplayed: !prevState.isChatDisplayed,
        }));
    };

    render() {
        const {
            location: {
                state: {paperboard},
            },
        } = this.props;

        console.log(paperboard);
        const {left, width, height, isChatDisplayed} = this.state;

        const {canvasWidth, canvasHeight} = getCanvasSize((height * 9) / 10, width);
        console.log({canvasWidth, canvasHeight});

        const sideList = (side) => (
            <div
                className={"list"}
                role="presentation"
                onClick={this.toggleDrawer(side, false)}
                onKeyDown={this.toggleDrawer(side, false)}>
                <List>
                    {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {["All mail", "Trash", "Spam"].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );

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
                    {sideList("left")}
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
                                />
                            </div>
                        )}
                        <div
                            onClick={() => this.onChat()}
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
