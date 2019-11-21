import React, {Component} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import Background from "../components/Background";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import CanvasManager from "../components/CanvasManager";
import EditShapePanel from "../components/EditShapePanel";
import * as backgroundImage from "../assets/cappuccino2.jpg";
import ShapePanel from "../components/ShapePanel";
import HeaderMenu from "../components/HeaderMenu";
import ChatComponent from "../components/ChatComponent";

class PaperBoardPage extends Component {
    constructor(props) {
        super(props);
        const {
            location: {
                state: {paperboard, pseudo, drawers},
            },
        } = props;
        this.state = {
            paperboard,
            pseudo,
            drawers,
        };
    }

    componentDidMount() {
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
    }

    componentWillUnmount() {
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
    }

    onQuit = () => {
        const {pseudo} = this.state;
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.LEAVE_BOARD,
            from: pseudo,
            to: "server",
            payload: {},
        });
    };

    render() {
        const {paperboard, drawers, pseudo} = this.state;
        return (
            <Background
                customStyle={{
                    display: "flex",
                    flexDirection: "column",
                }}
                imgSrc={backgroundImage}>
                {/* TITLE BAR (ON THE TOP) */}
                <HeaderMenu paperboard={paperboard} drawers={drawers} onQuit={this.onQuit} />
                {/* PAPERBOARD PAGE */}
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        // justifyContent: "space-between",
                        flex: 1,
                    }}>
                    {/* ACTION BUTTONS NAV BAR */}
                    <ShapePanel pseudo={pseudo} />

                    {/* CANVAS MANAGER */}
                    <CanvasManager
                        ref={(el) => (this.canvas = el)}
                        resolutionWidth={1080}
                        resolutionHeight={720}
                        toggleShapePanel={this.toggleShapePanel}
                    />

                    {/* SHAPE OPTIONS PANEL */}
                    <EditShapePanel />
                </div>
                {/* CHAT */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        position: "absolute",
                        bottom: 50,
                        right: 50,
                    }}>
                    <ChatComponent pseudo={pseudo} />
                </div>
            </Background>
        );
    }
}

PaperBoardPage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(PaperBoardPage);
