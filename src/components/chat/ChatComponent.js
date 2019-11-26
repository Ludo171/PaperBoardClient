import React, {Component} from "react";
import PropTypes from "prop-types";
import {Message as MessageIcon} from "@material-ui/icons";
import Chat from "./Chat";
import TextField from "@material-ui/core/TextField";
import Message from "./Message";
import socketClientInstance from "../../socket/socket";
import constants from "../../config/constants";

const color = require("string-to-color");

class ChatComponent extends Component {
    constructor(props) {
        super(props);
        this.componentName = "ChatComponent";
        this.state = {
            isChatDisplayed: false,
            textFieldValue: "",
            messages: [],
            messagedReceived: false,
        };
    }

    componentDidMount() {
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.CHAT_MESSAGE,
            this.receiveMessage,
            this.componentName
        );
    }

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.CHAT_MESSAGE,
            this.receiveMessage,
            this.componentName
        );
    }

    sendMessage = () => {
        const {pseudo} = this.props;
        const {textFieldValue} = this.state;
        if (textFieldValue !== "") {
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.CHAT_MESSAGE,
                from: pseudo,
                to: "server",
                payload: {
                    msg: textFieldValue,
                },
            });
            this.setState({textFieldValue: ""});
        }
    };

    receiveMessage = (writer, msg) => {
        const {pseudo} = this.props;
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
            messagedReceived: true,
        });
    };

    catchReturn = (e) => {
        if (e.key === "Enter") {
            this.sendMessage();
        }
    };

    handleTextFieldChange = (e) => {
        if (e.key === "Enter") {
            this.sendMessage();
        }
        this.setState({
            textFieldValue: e.target.value,
        });
    };

    onChat = () => {
        this.setState((prevState) => ({
            isChatDisplayed: !prevState.isChatDisplayed,
            messagedReceived: false,
        }));
    };

    render() {
        const {isChatDisplayed, messages, textFieldValue, messagedReceived} = this.state;
        return (
            <>
                {/* CHAT MESSAGE PANEL */}
                {isChatDisplayed && <Chat onCloseChat={this.onChat} messages={messages} />}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    {/* MESSAGE INPUT */}
                    {isChatDisplayed && (
                        <div style={{paddingRight: "15%"}}>
                            <TextField
                                id="outlined-basic"
                                label="Message"
                                margin="normal"
                                variant="outlined"
                                style={{backgroundColor: "white", borderRadius: 5}}
                                onChange={this.handleTextFieldChange}
                                onKeyPress={this.catchReturn}
                                value={textFieldValue}
                            />
                        </div>
                    )}
                    {/* CHAT PANEL BUTTON */}
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
                        {!isChatDisplayed && messagedReceived && (
                            <div
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: "red",
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                }}
                            />
                        )}
                        <MessageIcon
                            style={{
                                width: isChatDisplayed ? 20 : 60,
                                height: isChatDisplayed ? 20 : 60,
                            }}
                        />
                    </div>
                </div>
            </>
        );
    }
}
ChatComponent.propTypes = {
    pseudo: PropTypes.any,
};
export default ChatComponent;
