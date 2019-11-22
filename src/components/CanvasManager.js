import React, {Component} from "react";
import PropTypes from "prop-types";
import ReactResizeDetector from "react-resize-detector";
import generateCanvasObjectCircle from "./CanvasObject-Circle";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";

class CanvasManager extends Component {
    constructor(props) {
        super(props);
        this.objPile = [];
        this.state = {
            ctx: null,
            width: this.props.resolutionWidth,
            height: this.props.resolutionHeight,
        };
        this.ctx = null;
    }

    componentDidMount() {
        this.setState({ctx: this.canvas.getContext("2d")});
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
        this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
        this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
        this.canvas.addEventListener("mouseleave", () => this.handleMouseLeave());

        socketClientInstance.subscribeToEvent(
            constants.SOCKET_MSG.OBJECT_CREATED,
            this.createCircle,
            this
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
            this
        );
    }

    // --- INTERACTIONS WITH OTHER COMPONENTS
    createCircle = () => {
        const newCircle = generateCanvasObjectCircle(
            this.state.ctx,
            0,
            0,
            this.state.width,
            this.state.height,
            "150225f5srfzf"
        );
        this.objPile.push(newCircle);
        newCircle.refreshArea(0, 0, this.state.width, this.state.height);
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

        for (let i = 0; i < this.objPile.length; i++) {
            this.objPile[i].refreshArea(0, 0, this.state.width, this.state.height);
        }
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
            if (collisionIndex !== null) {
                this.refreshCanvasArea(0, 0, this.state.width, this.state.height);
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

            for (let i = 0; i < this.objPile.length; i++) {
                this.objPile[i].onMouseUp(x, y);
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
};
export default CanvasManager;
