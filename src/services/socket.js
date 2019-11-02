import io from "socket.io-client";
import config from "../config/config";
import constants from "../config/constants";
import Logger from "../utils/logger";

class SocketClient {
    constructor(pseudo, board) {
        // SINGLETON PATTERN
        if (!!SocketClient.instance) {
            return SocketClient.instance;
        }
        SocketClient.instance = this;

        // ATTRIBUTES
        this.componentName = "Socket Client";
        this.pseudo = pseudo;
        this.board = board;
        this.backend_url = `${config.hostname}:${config.socket_port}/websockets/v1/paperboard/${this.board}`;
        this.socketClient = null;

        // METHODS
        this.init = this.init.bind(this);
        this.stop = this.stop.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.logger = new Logger(this.componentName);

        return this;
    }

    init() {
        this.logger.log(`Connecting to WebSocketServer [${this.backend_url}]...`);
        const socket = io.connect(this.backend_url);
        this.socketClient = socket;
        this.socketClient.on("connect", () => this.onConnect());
        this.socketClient.on("message", (message) => this.onMessage(message));
        this.logger.log(this.socketClient);
    }
    stop() {
        this.socketClient.disconnect();
        this.socketClient = null;
    }

    onConnect() {
        this.sendMessage({
            type: constants.SOCKET_MSG.JOIN_BOARD,
            from: this.pseudo,
            to: "server",
            payload: {},
        });
    }
    onMessage(message) {
        let data = null;
        try {
            data = JSON.parse(message);
            this.logger.log(
                `Received ${data.type} from ${data.from === undefined ? "server" : data.from}.`
            );
        } catch (error) {
            this.logger.log("Invalid message sent through WebSocket. Unable to parse.", error);
            this.logger.log(message);
            data = {};
        }
        switch (data.type) {
            case constants.SIGNALING_SERVER.MSG_WELCOME:
                this.logger.log(
                    `Trigger welcome handlers (${this.handlers.welcomeHandlers.length}).`
                );
                this.handlers.welcomeHandlers.forEach((handleWelcome) => handleWelcome());
                break;
            case constants.SIGNALING_SERVER.MSG_CALL_REQUEST:
                this.logger.log(
                    `Trigger call request handlers (${this.handlers.callRequestHandlers.length}).`
                );
                this.logger.log(data);
                this.handlers.callRequestHandlers.forEach((callRequestHandler) =>
                    callRequestHandler(data.from, data.role, data.conference)
                );
                break;
            case constants.SIGNALING_SERVER.MSG_CALL_REQUEST_ANSWER:
                this.logger.log(
                    `Trigger call request answer handlers (${this.handlers.callRequestAnswerHandlers.length}).`
                );
                this.handlers.callRequestAnswerHandlers.forEach((callRequestAnswerHandler) =>
                    callRequestAnswerHandler(data.from, data.answer)
                );
                break;
            case constants.SIGNALING_SERVER.MSG_OFFER:
                this.logger.log(`Trigger offer handlers (${this.handlers.offerHandlers.length}).`);
                this.handlers.offerHandlers.forEach((handleOffer) =>
                    handleOffer(data.from, data.offer, data.conference)
                );
                break;
            case constants.SIGNALING_SERVER.MSG_ANSWER:
                this.logger.log(
                    `Trigger answer handlers (${this.handlers.answerHandlers.length}).`
                );
                this.handlers.answerHandlers.forEach((handleAnswer) =>
                    handleAnswer(data.from, data.answer)
                );
                break;
            case constants.SIGNALING_SERVER.MSG_CANDIDATE:
                this.logger.log(
                    `Trigger candidate handlers (${this.handlers.candidateHandlers.length}).`
                );
                this.handlers.candidateHandlers.forEach((handleCandidate) =>
                    handleCandidate(data.from, data.candidate)
                );
                break;
            case constants.SIGNALING_SERVER.MSG_CLOSE:
                this.logger.log(`Trigger close handlers (${this.handlers.closeHandlers.length}).`);
                this.handlers.closeHandlers.forEach((handleClose) => handleClose(data.from));
                break;
            case constants.SIGNALING_SERVER.MSG_USERS_UPDATE:
                this.logger.log(
                    `Trigger users update handlers (${this.handlers.usersUpdateHandlers.length}).`
                );
                this.handlers.usersUpdateHandlers.forEach((handleUsersUpdate) =>
                    handleUsersUpdate(data.usersList)
                );
                break;
            default:
                this.logger.log(
                    `Unexpected message type received ${data.type} - from ${data.from}.`
                );
        }
    }
    sendMessage(json) {
        let message = null;
        if (!json.type) {
            this.logger.log("A message must have a type to be sent !", json);
        } else {
            try {
                message = JSON.stringify(json);
                this.logger.log(
                    `Sending ${json.type} to ${json.to === undefined ? "server" : json.to}.`
                );
            } catch (error) {
                this.logger.log(
                    "Invalid message sent from the client socket. Unable to parse.",
                    error
                );
                message = {};
            }
            this.socketClient.emit("message", message);
        }
    }
}

export default SocketClient;
