import React from "react";
import {Link} from "react-router-dom";
import Logger from "../utils/logger";
import SocketClient from "../services/socket";

class PaperBoardPage extends React.Component {
    constructor(props) {
        super(props);

        // ATTRIBUTES
        this.componentName = "PaperBoard Page";
        this.logger = new Logger(this.componentName);

        // METHODS
        this.onConnectSocket = this.onConnectSocket.bind(this);
        this.onSendMessageThroughSocket = this.onSendMessageThroughSocket.bind(this);
    }

    onConnectSocket() {
        this.logger.log("Should Connect Socket Client");
        const socketClient = new SocketClient("RegisLeTest", "truc");
        socketClient.init();
    }

    onSendMessageThroughSocket() {
        this.logger.log("Should send a message");
    }

    render() {
        return (
            <div className="container">
                <h1>Default PaperBoard Page</h1>
                <div className="field">
                    <p className="control">
                        <button className="button is-success" onClick={this.onConnectSocket}>
                            Connect socket client to server
                        </button>
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button
                            className="button is-warning"
                            onClick={this.onSendMessageThroughSocket}>
                            Send static message through socket
                        </button>
                    </p>
                </div>
                <p>
                    <Link to="/lounge">Back to Lounge page</Link> oooohhh....
                </p>
            </div>
        );
    }
}

export default PaperBoardPage;
