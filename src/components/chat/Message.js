import React, {Component} from "react";
import PropTypes from "prop-types";

class Message extends Component {
    render() {
        const {color, name, message, isAuthor} = this.props;
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    paddingRight: "10%",
                    paddingLeft: "10%",
                }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexDirection: isAuthor ? "row" : "row-reverse",
                    }}>
                    {name}
                    <div
                        style={{
                            backgroundColor: color,
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            marginLeft: isAuthor ? 10 : 0,
                            marginRight: isAuthor ? 0 : 10,
                        }}>
                        {name[0]}
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        color: "black",
                        justifyContent: isAuthor ? "flex-end" : "flex-start",
                    }}>
                    {message}
                </div>
            </div>
        );
    }
}
Message.propTypes = {
    color: PropTypes.string,
    name: PropTypes.string,
    message: PropTypes.string,
    isAuthor: PropTypes.bool,
};
export default Message;
