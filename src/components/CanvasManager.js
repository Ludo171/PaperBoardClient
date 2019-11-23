import React, {Component} from "react";
import PropTypes from "prop-types";
import ReactResizeDetector from "react-resize-detector";
import generateCanvasObjectCircle from "./CanvasObject-Circle";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
const color = require("string-to-color");

class CanvasManager extends Component {
    constructor(props) {
        super(props);
        this.componentName = "CanvasManager";
        this.objPile = [];
        this.state = {
            ctx: null,
            width: this.props.resolutionWidth,
            height: this.props.resolutionHeight,
        };
        this.ctx = null;
    }

    componentDidMount() {
        this.setState({ctx: this.canvas.getContext("2d")}, () => {
            console.log(this.props.drawings);
            this.objPile = this.generateObjectPile(this.props.drawings);
        });
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        this.canvas.addEventListener("mouseleave", () => this.handleMouseLeave());

        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_CREATED,
            this.createCircle,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_LOCKED,
            this.onObjectLocked,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_UNLOCKED,
            this.onObjectUnlocked,
            this.componentName
        );
    }

    componentWillUnmount() {
        this.canvas.removeEventListener("mousedown", (e) => this.handleMouseDown(e));
        this.canvas.removeEventListener("mouseup", (e) => this.handleMouseUp(e));
        this.canvas.removeEventListener("mousemove", (e) => this.handleMouseMove(e));
        this.canvas.removeEventListener("mouseleave", () => this.handleMouseLeave());

        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.OBJECT_CREATED,
            this.createCircle,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.OBJECT_LOCKED,
            this.onObjectLocked,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.OBJECT_UNLOCKED,
            this.onObjectUnlocked,
            this.componentName
        );
    }

    generateObjectPile = (drawings) => {
        const {ctx, width, height} = this.state;
        const keys = Object.keys(drawings);
        if (keys.length > 0) {
            return keys.map((key) => {
                const drawing = drawings[key];
                switch (drawing.type) {
                    case "circle":
                        return generateCanvasObjectCircle(
                            ctx,
                            0,
                            0,
                            width,
                            height,
                            drawing.id,
                            drawing.owner.pseudo,
                            {
                                X: drawing.position.x,
                                Y: drawing.position.y,
                                radius: drawing.radius,
                                lineWidth: drawing.lineWidth,
                                lineColor: drawing.lineColor,
                            }
                        );
                        break;
                }
            });
        } else {
            return [];
        }
    };

    // --- INTERACTIONS WITH OTHER COMPONENTS
    createCircle = (data) => {
        const newCircle = generateCanvasObjectCircle(
            this.state.ctx,
            0,
            0,
            this.state.width,
            this.state.height,
            data.id,
            data.pseudo,
            {
                X: parseFloat(data.X),
                Y: parseFloat(data.Y),
                radius: parseFloat(data.radius),
                lineWidth: parseFloat(data.lineWidth),
                lineColor: data.lineColor,
            }
        );
        this.objPile.push(newCircle);
        newCircle.refreshArea(0, 0, this.state.width, this.state.height);
    };

    onObjectLocked = (payload) => {
        const objectId = payload.drawingId;
        const lockedBy = payload.pseudo;
        let found = false;
        let i = 0;
        while (i < this.objPile.length && !found) {
            if (this.objPile[i].id === objectId) {
                found = true;
            } else {
                i += 1;
            }
        }
        if (found) {
            this.objPile[i].isLocked = true;
            this.objPile[i].lockedBy = lockedBy;
            this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
        }
    };
    onObjectUnlocked = (payload) => {
        const objectId = payload.drawingId;
        let found = false;
        let i = 0;
        while (i < this.objPile.length && !found) {
            if (this.objPile[i].id === objectId) {
                found = true;
            } else {
                i += 1;
            }
        }
        if (found) {
            this.objPile[i].isLocked = false;
            this.objPile[i].lockedBy = "";
            this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
        }
    };

    // --- CANVAS MANAGEMENT
    _onResize() {
        const margin = 20;
        const maxWidth = this.parentContainer.clientWidth - margin;
        const maxHeight = this.parentContainer.clientHeight - margin;
        const parentContainerProp = maxHeight / maxWidth;

        const canvasProp = this.props.resolutionHeight / this.props.resolutionWidth;

        if (canvasProp > parentContainerProp) {
            this.canvas.height = this.props.resolutionHeight;
            this.canvas.style.height = `${maxHeight}px`;
            this.canvas.width = this.props.resolutionWidth;
            this.canvas.style.width = `${maxHeight / canvasProp}px`;
        } else {
            this.canvas.width = this.props.resolutionWidth;
            this.canvas.style.width = `${maxWidth}px`;
            this.canvas.height = this.props.resolutionHeight;
            this.canvas.style.height = `${maxWidth * canvasProp}px`;
        }

        this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
    }

    refreshCanvasArea(x1, y1, x2, y2) {
        this.state.ctx.clearRect(x1, y1, x2, y2);
        for (let i = 0; i < this.objPile.length; i++) {
            this.objPile[i].refreshArea(x1, y1, x2, y2);
        }
    }

    // --- GESTURES MANAGEMENT
    handleMouseDown(e) {
        // Handle left click down
        if (e.which === 1) {
            const rect = this.canvas.getBoundingClientRect();
            const x =
                ((e.clientX - rect.left) * this.state.width) /
                Number(this.canvas.style.width.replace("px", ""));
            const y =
                ((e.clientY - rect.top) * this.state.height) /
                Number(this.canvas.style.height.replace("px", ""));
            console.log(`Click !! x:${x}, y:${y}`);

            let i = this.objPile.length;
            let collisionIndex = null;
            while (i--) {
                if (this.objPile[i].onMouseDown && this.objPile[i].onMouseDown(x, y)) {
                    collisionIndex = i;
                    i = 0; // end of collision detection
                }
            }

            // Unlock any other object not selected on this click
            for (let i = 0; i < this.objPile.length; i++) {
                if (i !== collisionIndex && this.objPile[i].isLocked) {
                    // Unlock any object that has been previously locked
                    socketClientInstance.sendMessage({
                        type: constants.SOCKET_MSG.UNLOCK_OBJECT,
                        from: this.props.pseudo,
                        to: "server",
                        payload: {
                            drawingId: this.objPile[i].id,
                        },
                    });
                }
            }

            // Try to lock the selected object
            if (collisionIndex !== null && !this.objPile[collisionIndex].isLocked) {
                const object = this.objPile[collisionIndex];
                console.log(this.props);
                socketClientInstance.sendMessage({
                    type: constants.SOCKET_MSG.LOCK_OBJECT,
                    from: this.props.pseudo,
                    to: "server",
                    payload: {
                        drawingId: object.id,
                    },
                });
            }
        }
    }

    handleMouseMove(e) {
        // Handle Move over canvas
        if (e.which === 0) {
            const rect = this.canvas.getBoundingClientRect();
            const x =
                ((e.clientX - rect.left) * this.state.width) /
                Number(this.canvas.style.width.replace("px", ""));
            const y =
                ((e.clientY - rect.top) * this.state.height) /
                Number(this.canvas.style.height.replace("px", ""));

            let i = this.objPile.length;
            let collisionIndex = null;
            while (i--) {
                if (this.objPile[i].onMouseHover && this.objPile[i].onMouseHover(x, y)) {
                    collisionIndex = i;
                    i = 0; // end of collision detection
                }
            }
            if (collisionIndex === null) {
                const elementToChange = document.getElementsByTagName("body")[0];
                elementToChange.style.cursor = "url('cursor url with protocol'), pointer";
            }
        } else if (e.which === 1) {
            const rect = this.canvas.getBoundingClientRect();
            const x =
                ((e.clientX - rect.left) * this.state.width) /
                Number(this.canvas.style.width.replace("px", ""));
            const y =
                ((e.clientY - rect.top) * this.state.height) /
                Number(this.canvas.style.height.replace("px", ""));

            let i = this.objPile.length;
            let collisionIndex = null;
            while (i--) {
                if (this.objPile[i].onMouseDrag && this.objPile[i].onMouseDrag(x, y)) {
                    collisionIndex = i;
                    i = 0; // end of collision detection
                }
            }
            if (collisionIndex !== null) {
                this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
            }
        }
    }

    handleMouseUp(e) {
        // Handle left click down
        if (e.which === 1) {
            const rect = this.canvas.getBoundingClientRect();
            const x =
                ((e.clientX - rect.left) * this.state.width) /
                Number(this.canvas.style.width.replace("px", ""));
            const y =
                ((e.clientY - rect.top) * this.state.height) /
                Number(this.canvas.style.height.replace("px", ""));

            console.log("ON MOUSE UP");
            for (let i = 0; i < this.objPile.length; i++) {
                const report = this.objPile[i].onMouseUp(x, y);
                console.log(report);
                if (Object.keys(report.modifications).length > 0) {
                    console.log(`Should send modifications for ${this.objPile[i].name}`);
                    const payload = report.modifications;
                    payload.pseudo = this.props.pseudo;
                    payload.board = this.props.board.title;
                    payload.drawingId = this.objPile[i].id;
                    socketClientInstance.sendMessage({
                        type: constants.SOCKET_MSG.EDIT_OBJECT,
                        from: this.props.pseudo,
                        to: "server",
                        payload,
                    });
                }

                if (report.shouldUnlock) {
                    socketClientInstance.sendMessage({
                        type: constants.SOCKET_MSG.UNLOCK_OBJECT,
                        from: this.props.pseudo,
                        to: "server",
                        payload: {
                            drawingId: this.objPile[i].id,
                        },
                    });
                }
            }
        }
    }

    handleMouseLeave() {
        const elementToChange = document.getElementsByTagName("body")[0];
        elementToChange.style.cursor = "url('cursor url with protocol'), default";
    }

    render() {
        return (
            <div
                ref={(el) => (this.parentContainer = el)}
                id="paperboard-canvas"
                style={{
                    flex: 1,
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ReactResizeDetector handleWidth handleHeight onResize={() => this._onResize()} />
                <canvas
                    ref={(el) => (this.canvas = el)}
                    id="canvascanvas"
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                    }}
                />
            </div>
        );
    }
}
CanvasManager.propTypes = {
    resolutionWidth: PropTypes.any,
    resolutionHeight: PropTypes.any,
    toggleShapePanel: PropTypes.any,
    board: PropTypes.any,
    pseudo: PropTypes.any,
    drawings: PropTypes.any,
};
export default CanvasManager;
