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
import DeletePopUp from "../components/DeletePopUp";

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
            selectedDrawing: null,
            isDeletePopUpDisplayed: false,
            deleteMsg: null,
        };
        this.componentName = "PaperBoardPage";
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_LEFT_BOARD,
            this.handleDrawerLeftBoard,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleDrawerJoinedBoard,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.DELETE_OBJECT,
            this.handleObjectDelete,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_DELETED,
            this.handleObjectDeleted,
            this.componentName
        );
    }

    componentWillUnmount() {
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_LEFT_BOARD,
            this.handleDrawerLeftBoard,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DRAWER_JOIN_BOARD,
            this.handleDrawerJoinedBoard,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.DELETE_OBJECT,
            this.handleObjectDelete,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.OBJECT_DELETED,
            this.handleObjectDeleted,
            this.componentName
        );
        this._mounted = false;
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

    setSelectedDrawing = (selected, unlockId) => {
        this.setState((prevState) => {
            if (
                unlockId &&
                prevState.selectedDrawing &&
                prevState.selectedDrawing.id === unlockId
            ) {
                return {selectedDrawing: null};
            }
            return {selectedDrawing: selected};
        });
    };

    handleDrawerLeftBoard = (leaver, drawers) => {
        if (this._mounted) {
            this.setState({drawers});
            const {pseudo} = this.state;
            if (pseudo === leaver) {
                this.props.history.push({pathname: "/lounge", state: {pseudo}});
            }
        }
    };

    handleDrawerJoinedBoard = (drawers) => {
        this.setState({drawers});
    };

    handleObjectDelete = (msg) => {
        this.setState((prevState) => ({
            isDeletePopUpDisplayed: !prevState.isDeletePopUpDisplayed,
            deleteMsg: !prevState.isDeletePopUpDisplayed ? msg : null,
        }));
    };

    handleObjectDeleted = (msg) => {
        const {selectedDrawing} = this.state;
        if (selectedDrawing && selectedDrawing.drawingId === msg.drawingId) {
            this.setState({selectedDrawing: null});
        }
    };

    render() {
        const {
            paperboard,
            drawers,
            pseudo,
            selectedDrawing,
            isDeletePopUpDisplayed,
            deleteMsg,
        } = this.state;
        const resolutionHeight = 720;
        const resolutionWidth = 1080;
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
                {isDeletePopUpDisplayed && deleteMsg && (
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <DeletePopUp msg={deleteMsg} handleObjectDelete={this.handleObjectDelete} />
                    </div>
                )}
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
                    <ShapePanel
                        pseudo={pseudo}
                        resolutionWidth={resolutionWidth}
                        resolutionHeight={resolutionHeight}
                    />

                    {/* CANVAS MANAGER */}
                    <CanvasManager
                        ref={(el) => (this.canvas = el)}
                        resolutionWidth={resolutionWidth}
                        resolutionHeight={resolutionHeight}
                        toggleShapePanel={this.toggleShapePanel}
                        board={paperboard}
                        pseudo={pseudo}
                        drawings={paperboard.drawings}
                        setSelectedDrawing={this.setSelectedDrawing}
                    />

                    {/* SHAPE OPTIONS PANEL */}
                    <EditShapePanel selectedDrawing={selectedDrawing} />
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
