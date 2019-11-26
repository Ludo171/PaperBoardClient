import React, {Component} from "react";
import PropTypes from "prop-types";
import ReactResizeDetector from "react-resize-detector";
import generateCanvasObjectCircle from "./CanvasObject-Circle";
import generateCanvasObjectImage from "./CanvasObject-Image";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import generateCanvasObjectBackgroundImage from "./CanvasObject-BackgroundImage";
import generateCanvasObjectBackgroundColor from "./CanvasObject-BackgroundColor";
import generateCanvasObjectLine from "./CanvasObject-Line";
import generateCanvasObjectRectangle from "./CanvasObject-Rectangle";
import generateCanvasObjectHandwriting from "./CanvasObject-Handwriting";

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
        this.background = null;
    }

    componentDidMount() {
        this.setState({ctx: this.canvas.getContext("2d")}, () => {
            this.generateObjectPile(this.props.drawings).then((result) => {
                this.objPile = result;
                this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
            });
        });
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        this.canvas.addEventListener("mouseleave", () => this.handleMouseLeave());

        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_CREATED,
            this.createObject,
            this.componentName
        );
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_EDITED,
            this.onObjectEdited,
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
        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_DELETED,
            this.onObjectDeleted,
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
            this.createObject,
            this.componentName
        );
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.OBJECT_EDITED,
            this.onObjectEdited,
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
        socketClientInstance.unsubscribeToEvent(
            constants.SOCKET_MSG.OBJECT_DELETED,
            this.onObjectDeleted,
            this.componentName
        );
    }

    generateObjectPile = async (drawings) => {
        console.log("Generate paperboard");
        console.log(drawings);
        // Load Background
        if (this.props.board.backgroundImage !== "") {
            this.background = await generateCanvasObjectBackgroundImage(
                this.state.ctx,
                0,
                0,
                this.state.width,
                this.state.height,
                this.props.board.backgroundImage
            );
        } else if (this.props.board.backgroundColor !== "") {
            this.background = await generateCanvasObjectBackgroundColor(
                this.state.ctx,
                0,
                0,
                this.state.width,
                this.state.height,
                this.props.board.backgroundColor
            );
        }

        // Build Obj Pile from Board Drawings descriptions
        const {ctx, width, height} = this.state;
        const newObjPile = [];
        const keys = Object.keys(drawings);
        for (let i = 0; i < keys.length; i++) {
            const descr = drawings[keys[i]];
            if (descr.type === "circle") {
                newObjPile.push(
                    await generateCanvasObjectCircle(
                        ctx,
                        0,
                        0,
                        width,
                        height,
                        descr.drawingId,
                        descr.owner.pseudo,
                        {
                            X: descr.position.x,
                            Y: descr.position.y,
                            radius: descr.radius,
                            lineWidth: descr.lineWidth,
                            lineColor: descr.lineColor,
                            fillColor: descr.fillColor,
                            lineStyle: descr.lineStyle,
                            isLocked: descr.isLocked,
                            lockedBy: descr.lockedBy,
                        }
                    )
                );
            } else if (descr.type === "image") {
                newObjPile.push(
                    await generateCanvasObjectImage(
                        ctx,
                        0,
                        0,
                        width,
                        height,
                        descr.srcURI,
                        descr.drawingId,
                        descr.owner.pseudo,
                        {
                            X: descr.position.x,
                            Y: descr.position.y,
                            width: descr.width,
                            height: descr.height,
                            isLocked: descr.isLocked,
                            lockedBy: descr.lockedBy,
                        }
                    )
                );
            } else if (descr.type === "line") {
                newObjPile.push(
                    await generateCanvasObjectLine(
                        ctx,
                        0,
                        0,
                        width,
                        height,
                        descr.drawingId,
                        descr.owner.pseudo,
                        {
                            X: descr.position.x,
                            Y: descr.position.y,
                            positionEndPoint: {
                                x: descr.positionEndPoint.x,
                                y: descr.positionEndPoint.y,
                            },
                            lineWidth: descr.lineWidth,
                            lineColor: descr.lineColor,
                            lineStyle: descr.lineStyle,
                            isLocked: descr.isLocked,
                            lockedBy: descr.lockedBy,
                        }
                    )
                );
            } else if (descr.type === "rectangle") {
                newObjPile.push(
                    await generateCanvasObjectRectangle(
                        ctx,
                        0,
                        0,
                        width,
                        height,
                        descr.drawingId,
                        descr.owner.pseudo,
                        {
                            X: descr.position.x,
                            Y: descr.position.y,
                            width: descr.width,
                            height: descr.height,
                            lineWidth: descr.lineWidth,
                            lineColor: descr.lineColor,
                            fillColor: descr.fillColor,
                            lineStyle: descr.lineStyle,
                            isLocked: descr.isLocked,
                            lockedBy: descr.lockedBy,
                        }
                    )
                );
            } else if (descr.type === "handwriting") {
                newObjPile.push(
                    await generateCanvasObjectHandwriting(
                        ctx,
                        0,
                        0,
                        width,
                        height,
                        descr.drawingId,
                        descr.owner.pseudo,
                        {
                            X: descr.position.x,
                            Y: descr.position.y,
                            pathX: descr.pathX,
                            pathY: descr.pathY,
                            lineWidth: descr.lineWidth,
                            lineColor: descr.lineColor,
                            isLocked: descr.isLocked,
                            lockedBy: descr.lockedBy,
                        }
                    )
                );
            } else {
                console.log("Shape loading unhandled for this type");
            }
        }
        return newObjPile;
    };

    // --- INTERACTIONS WITH OTHER COMPONENTS
    createObject = async (data) => {
        console.log("Should Create Object");
        console.log(data);
        if (data.type === "image") {
            const newImg = await generateCanvasObjectImage(
                this.state.ctx,
                0,
                0,
                this.state.width,
                this.state.height,
                data.srcURI,
                data.drawingId,
                data.pseudo,
                {
                    X: parseFloat(data.position.x),
                    Y: parseFloat(data.position.y),
                    width: parseFloat(data.width),
                    height: parseFloat(data.height),
                }
            );
            this.objPile.push(newImg);
            newImg.refreshArea(0, 0, this.state.width, this.state.height);
        } else if (data.type === "circle") {
            const newCircle = await generateCanvasObjectCircle(
                this.state.ctx,
                0,
                0,
                this.state.width,
                this.state.height,
                data.drawingId,
                data.pseudo,
                {
                    X: parseFloat(data.position.x),
                    Y: parseFloat(data.position.y),
                    radius: parseFloat(data.radius),
                    lineWidth: parseFloat(data.lineWidth),
                    lineColor: data.lineColor,
                    lineStyle: data.lineStyle,
                    fillColor: data.fillColor,
                }
            );
            this.objPile.push(newCircle);
            newCircle.refreshArea(0, 0, this.state.width, this.state.height);
        } else if (data.type === "line") {
            const newLine = await generateCanvasObjectLine(
                this.state.ctx,
                0,
                0,
                this.state.width,
                this.state.height,
                data.drawingId,
                data.pseudo,
                {
                    X: parseFloat(data.position.x),
                    Y: parseFloat(data.position.y),
                    positionEndPoint: {
                        x: parseFloat(data.positionEndPoint.x),
                        y: parseFloat(data.positionEndPoint.y),
                    },
                    lineWidth: parseFloat(data.lineWidth),
                    lineColor: data.lineColor,
                    lineStyle: data.lineStyle,
                }
            );
            this.objPile.push(newLine);
            newLine.refreshArea(0, 0, this.state.width, this.state.height);
        } else if (data.type === "rectangle") {
            const newRectangle = await generateCanvasObjectRectangle(
                this.state.ctx,
                0,
                0,
                this.state.width,
                this.state.height,
                data.drawingId,
                data.pseudo,
                {
                    X: parseFloat(data.position.x),
                    Y: parseFloat(data.position.y),
                    width: parseFloat(data.width),
                    height: parseFloat(data.height),
                    lineWidth: parseFloat(data.lineWidth),
                    lineColor: data.lineColor,
                    lineStyle: data.lineStyle,
                    fillColor: data.fillColor,
                }
            );
            this.objPile.push(newRectangle);
            newRectangle.refreshArea(0, 0, this.state.width, this.state.height);
        } else if (data.type === "handwriting") {
            const newHandwriting = await generateCanvasObjectHandwriting(
                this.state.ctx,
                0,
                0,
                this.state.width,
                this.state.height,
                data.drawingId,
                data.pseudo,
                {
                    X: parseFloat(data.position.x),
                    Y: parseFloat(data.position.y),
                    pathX: data.pathX.map(parseFloat),
                    pathY: data.pathY.map(parseFloat),
                    lineWidth: parseFloat(data.lineWidth),
                    lineColor: data.lineColor,
                    lineStyle: data.lineStyle,
                }
            );
            this.objPile.push(newHandwriting);
            newHandwriting.refreshArea(0, 0, this.state.width, this.state.height);
        } else {
            console.log("Default case for Object Created Handler in Canvas Manager");
        }
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
            if (this.props.pseudo === lockedBy) {
                const {
                    pseudo,
                    board: {title},
                    setSelectedDrawing,
                } = this.props;
                setSelectedDrawing(
                    {
                        pseudo,
                        board: title,
                        drawingId: objectId,
                        type: this.objPile[i].type,
                    },
                    null
                );
            }
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
            if (this.props.pseudo === this.objPile[i].lockedBy) {
                const {setSelectedDrawing} = this.props;
                setSelectedDrawing(null, this.objPile[i].id);
            }
            this.objPile[i].isLocked = false;
            this.objPile[i].lockedBy = "";
            this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
        }
    };
    onObjectEdited = (payload) => {
        console.log("On Object Edited !");
        console.log(payload);
        for (let i = 0; i < this.objPile.length; i++) {
            if (this.objPile[i].id === payload.drawingId) {
                this.objPile[i].applyModifications(payload);
            }
        }
        this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
    };

    onObjectDeleted = (payload) => {
        this.objPile = this.objPile.filter((obj) => obj.id !== payload.drawingId);
        this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
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
        if (this.background !== null) {
            this.background.refreshArea(x1, y1, x2, y2);
        }
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
                if (
                    this.objPile[i].onMouseDown &&
                    this.objPile[i].onMouseDown(x, y, this.props.pseudo)
                ) {
                    collisionIndex = i;
                    i = 0; // end of collision detection
                }
            }

            // Unlock any other object not selected on this click
            for (let i = 0; i < this.objPile.length; i++) {
                if (i !== collisionIndex && this.objPile[i].lockedBy === this.props.pseudo) {
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
                socketClientInstance.sendMessage({
                    type: constants.SOCKET_MSG.LOCK_OBJECT,
                    from: this.props.pseudo,
                    to: "server",
                    payload: {
                        drawingId: object.id,
                    },
                });
            }
            console.log(this.objPile);
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
                if (
                    this.objPile[i].onMouseHover &&
                    this.objPile[i].onMouseHover(x, y, this.props.pseudo)
                ) {
                    collisionIndex = i;
                    i = 0; // end of collision detection
                }
            }
            if (collisionIndex === null) {
                const elementToChange = document.getElementsByTagName("body")[0];
                elementToChange.style.cursor = "url('cursor url with protocol'), default";
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
                if (
                    this.objPile[i].onMouseDrag &&
                    this.objPile[i].onMouseDrag(x, y, this.props.pseudo)
                ) {
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
        const {
            pseudo,
            board: {title},
        } = this.props;
        // Handle left click up
        if (e.which === 1) {
            const rect = this.canvas.getBoundingClientRect();
            const x =
                ((e.clientX - rect.left) * this.state.width) /
                Number(this.canvas.style.width.replace("px", ""));
            const y =
                ((e.clientY - rect.top) * this.state.height) /
                Number(this.canvas.style.height.replace("px", ""));

            for (let i = 0; i < this.objPile.length; i++) {
                const report = this.objPile[i].onMouseUp(x, y, this.props.pseudo);
                if (Object.keys(report.modifications).length > 0) {
                    const payload = report.modifications;
                    payload.pseudo = pseudo;
                    payload.board = title;
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
    setSelectedDrawing: PropTypes.any,
};
export default CanvasManager;
