import React, {Component} from "react";
import PropTypes from "prop-types";
import {Close} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
class Chat extends Component {
    render() {
        const {onCloseChat, messages} = this.props;
        return (
            <div
                id="page"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "100%",
                    backgroundColor: "#e8e8e8",
                    height: window.innerHeight / 3,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#e8e8e8",
                }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "horizontal",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: "5%",
                        paddingLeft: "5%",
                        backgroundColor: "#f9a322",
                        width: "100%",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        marginBottom: 10,
                    }}>
                    <div> Chat</div>
                    <IconButton onClick={() => onCloseChat()}>
                        <Close />
                    </IconButton>
                </div>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        width: "100%",
                        overflow: "scroll",
                        flexDirection: "column",
                    }}>
                    {messages}
                </div>
            </div>
        );
    }
}

Chat.propTypes = {
    onCloseChat: PropTypes.any,
    messages: PropTypes.any,
};
export default Chat;
