import config from "../config/config";
import constants from "../config/constants";
import Logger from "../utils/logger";

class SocketClient {
    constructor() {
        // SINGLETON PATTERN
        if (!!SocketClient.instance) {
            return SocketClient.instance;
        }
        SocketClient.instance = this;

        // ATTRIBUTES
        this.componentName = "Socket Client";
        this.backend_url = `${config.socket_url}`;
        this.socketClient = null;
        this.connected = false;
        this.reconnectionParams = {
            reconnect: true,
            reconnectionDelay: 1000,
            maxAttempts: 50,
            currentAttemps: 0,
        };

        // METHODS
        this.init = this.init.bind(this);
        this.stop = this.stop.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.handlers = {
            identifiedHandlers: [],
            drawerJoinedBoardHandlers: [],
            drawerLeftBoardHandlers: [],
            chatMessageHandlers: [],
            askDeletionHandlers: [],
            objLockedHandlers: [],
            objUnlockedHandlers: [],
            objCreatedHandlers: [],
            objEditedHandlers: [],
            objDeletedHandlers: [],
            drawerConnectedHandlers: [],
            drawerDisconnectedHandlers: [],
        };
        this.logger = new Logger(this.componentName);

        return this;
    }

    init() {
        this.logger.log(`Try to connect to WebSocketServer [${this.backend_url}]...`);
        this.reconnectionParams.currentAttemps += 1;
        const socket = new WebSocket(this.backend_url);
        this.socketClient = socket;
        this.socketClient.onopen = this.onConnect;
        this.socketClient.onmessage = this.onMessage;
        this.socketClient.onclose = this.onDisconnect;
    }
    stop() {
        this.tryToReconnect = false;
        this.socketClient.close();
        this.socketClient = null;
    }

    onConnect() {
        this.logger.log(`Connection successful to [${this.backend_url}]`);
        this.connected = true;
        this.reconnectionParams.currentAttemps = 0;
    }
    onDisconnect(e) {
        if (this.reconnectionParams.currentAttemps < 2) {
            this.handlers.drawerDisconnectedHandlers.forEach((drawerDisconnectedHandler) => {
                drawerDisconnectedHandler();
            });
        }
        switch (e.code) {
            case 1000: // CLOSE_NORMAL
                break;
            default:
                // CLOSE_ABNORMAL
                const {
                    reconnect,
                    maxAttempts,
                    currentAttemps,
                    reconnectionDelay,
                } = this.reconnectionParams;
                if (reconnect && currentAttemps < maxAttempts) {
                    setTimeout(this.init, reconnectionDelay);
                }
                break;
        }
        this.logger.log(`Disconnected from server [${this.backend_url}]`);
    }
    onMessage(socketMessage) {
        let data = null;
        try {
            data = JSON.parse(socketMessage.data);
            this.logger.log(
                `Received ${data.type} from ${data.from === undefined ? "server" : data.from}.`
            );
        } catch (error) {
            this.logger.log("Invalid message sent through WebSocket. Unable to parse.", error);
            this.logger.log(socketMessage);
            data = {};
        }
        switch (data.type) {
            case constants.SOCKET_MSG.IDENTIFY_ANSWER:
                this.logger.log(
                    `Trigger identified handlers (${this.handlers.identifiedHandlers.length}).`
                );
                this.handlers.identifiedHandlers.forEach((identifiedHandler) => {
                    identifiedHandler(data);
                });
                break;
            case constants.SOCKET_MSG.DRAWER_JOIN_BOARD:
                this.logger.log(
                    `Trigger drawer joined board handlers (${this.handlers.drawerJoinedBoardHandlers.length}).`
                );
                this.handlers.drawerJoinedBoardHandlers.forEach((drawerJoinedBoardHandler) => {
                    drawerJoinedBoardHandler(data.payload.userlist);
                });
                break;
            case constants.SOCKET_MSG.DRAWER_LEFT_BOARD:
                this.logger.log(
                    `Trigger drawer left board handlers (${this.handlers.drawerLeftBoardHandlers.length}).`
                );
                this.handlers.drawerLeftBoardHandlers.forEach((drawerLeftBoardHandler) => {
                    drawerLeftBoardHandler(data.payload.leaver, data.payload.userlist);
                });
                break;
            case constants.SOCKET_MSG.CHAT_MESSAGE:
                this.logger.log(
                    `Trigger chat message handlers (${this.handlers.chatMessageHandlers.length}).`
                );
                this.handlers.chatMessageHandlers.forEach((chatMessageHandler) => {
                    chatMessageHandler(data.payload.writer, data.payload.msg);
                });
                break;
            case constants.SOCKET_MSG.ASK_DELETION:
                this.logger.log(
                    `Trigger ask deletion handlers (${this.handlers.askDeletionHandlers.length}).`
                );
                this.handlers.askDeletionHandlers.forEach((askDeletionHandler) =>
                    askDeletionHandler()
                );
                break;
            case constants.SOCKET_MSG.OBJECT_LOCKED:
                this.logger.log(
                    `Trigger object locked handlers (${this.handlers.objLockedHandlers.length}).`
                );
                this.handlers.objLockedHandlers.forEach((objLockedHandler) =>
                    objLockedHandler(data.payload)
                );
                break;
            case constants.SOCKET_MSG.OBJECT_UNLOCKED:
                this.logger.log(
                    `Trigger object unlocked handlers (${this.handlers.objUnlockedHandlers.length}).`
                );
                this.handlers.objUnlockedHandlers.forEach((objUnlockedHandler) =>
                    objUnlockedHandler(data.payload)
                );
                break;
            case constants.SOCKET_MSG.OBJECT_CREATED:
                this.logger.log(
                    `Trigger object created handlers (${this.handlers.objCreatedHandlers.length}).`
                );
                this.handlers.objCreatedHandlers.forEach((objCreatedHandler) =>
                    objCreatedHandler(data.payload)
                );
                break;
            case constants.SOCKET_MSG.OBJECT_EDITED:
                this.logger.log(
                    `Trigger object edited (${this.handlers.objEditedHandlers.length}).`
                );
                this.handlers.objEditedHandlers.forEach((objEditedHandler) =>
                    objEditedHandler(data.payload)
                );
                break;
            case constants.SOCKET_MSG.OBJECT_DELETED:
                this.logger.log(
                    `Trigger object deleted (${this.handlers.objDeletedHandlers.length}).`
                );
                this.handlers.objDeletedHandlers.forEach((objDeletedHandler) =>
                    objDeletedHandler()
                );
                break;
            case constants.SOCKET_MSG.DRAWER_CONNECTED:
                this.logger.log(
                    `Trigger drawer connected handlers (${this.handlers.drawerConnectedHandlers.length}).`
                );
                this.handlers.drawerConnectedHandlers.forEach((drawerConnectedHandler) => {
                    drawerConnectedHandler(data.payload.userlist);
                });
                break;
            case constants.SOCKET_MSG.DRAWER_DISCONNECTED:
                this.logger.log(
                    `Trigger drawer disconnected handlers (${this.handlers.drawerDisconnectedHandlers.length}).`
                );
                this.handlers.drawerDisconnectedHandlers.forEach((drawerDisconnectedHandler) =>
                    drawerDisconnectedHandler(data.from)
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
            if (this.socketClient) {
                this.socketClient.send(message);
            } else {
                alert("You have been disconnected, don't forgzt to reconnect");
            }
        }
    }

    subscribeToEvent(eventName, handler, subscriber) {
        switch (eventName) {
            case constants.SOCKET_MSG.IDENTIFY_ANSWER:
                this.handlers.identifiedHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.DRAWER_JOIN_BOARD:
                this.handlers.drawerJoinedBoardHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.DRAWER_LEFT_BOARD:
                this.handlers.drawerLeftBoardHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.CHAT_MESSAGE:
                this.handlers.chatMessageHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.ASK_DELETION:
                this.handlers.askDeletionHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.OBJECT_LOCKED:
                this.handlers.objLockedHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.OBJECT_UNLOCKED:
                this.handlers.objUnlockedHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.OBJECT_CREATED:
                this.handlers.objCreatedHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.OBJECT_EDITED:
                this.handlers.objEditedHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.OBJECT_DELETED:
                this.handlers.objDeletedHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.DRAWER_CONNECTED:
                this.handlers.drawerConnectedHandlers.push(handler);
                break;
            case constants.SOCKET_MSG.DRAWER_DISCONNECTED:
                this.handlers.drawerDisconnectedHandlers.push(handler);
                break;
            default:
                this.logger.log(
                    `Component [${subscriber}] attempted to subscribe to unexpected event [${eventName}].`
                );
        }
        this.logger.log(`Component [${subscriber}] subscribed to ${eventName}.`);
    }
    unsubscribeToEvent(eventName, handler, subscriber) {
        switch (eventName) {
            case constants.SOCKET_MSG.IDENTIFY_ANSWER:
                this.handlers.identifiedHandlers = this.handlers.identifiedHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.DRAWER_JOIN_BOARD:
                this.handlers.drawerJoinedBoardHandlers = this.handlers.drawerJoinedBoardHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.DRAWER_LEFT_BOARD:
                this.handlers.drawerLeftBoardHandlers = this.handlers.drawerLeftBoardHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.CHAT_MESSAGE:
                this.handlers.chatMessageHandlers = this.handlers.chatMessageHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.ASK_DELETION:
                this.handlers.askDeletionHandlers = this.handlers.askDeletionHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.OBJECT_LOCKED:
                this.handlers.objLockedHandlers = this.handlers.objLockedHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.OBJECT_UNLOCKED:
                this.handlers.objUnlockedHandlers = this.handlers.objUnlockedHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.OBJECT_CREATED:
                this.handlers.objCreatedHandlers = this.handlers.objCreatedHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.OBJECT_EDITED:
                this.handlers.objEditedHandlers = this.handlers.objEditedHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.OBJECT_DELETED:
                this.handlers.objDeletedHandlers = this.handlers.objDeletedHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.DRAWER_CONNECTED:
                this.handlers.drawerConnectedHandler = this.handlers.drawerConnectedHandler.filter(
                    (fn) => fn !== handler
                );
                break;
            case constants.SOCKET_MSG.DRAWER_DISCONNECTED:
                this.handlers.drawerDisconnectedHandlers = this.handlers.drawerDisconnectedHandlers.filter(
                    (fn) => fn !== handler
                );
                break;
            default:
                this.logger.log(
                    `Component [${subscriber}] attempted to unsubscribe from unexpected event [${eventName}].`
                );
        }
        this.logger.log(`Component [${subscriber}] unsubscribed from ${eventName}.`);
    }
}

const socketClientInstance = new SocketClient();
export default socketClientInstance;
