import React, {Component} from "react";
import PropTypes from "prop-types";
import ReactResizeDetector from "react-resize-detector";

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxWidth: "100%",
        };
    }

    componentDidMount() {
        this.count = 0;
    }
    createCircle = () => {
        alert("circle created in canvas");
    };

    selectShape = () => {
        this.props.toggleShapePanel();
        alert("shape selected");
    };

    editShape = () => {
        alert("edit canvas shape");
    };

    _onResize() {
        const margin = 50;
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
                    }}
                />
                <div
                    onClick={this.selectShape}
                    style={{backgroundColor: "white", position: "absolute"}}>
                    test select shape
                </div>
            </div>
        );
    }
}
Canvas.propTypes = {
    resolutionWidth: PropTypes.any,
    resolutionHeight: PropTypes.any,
    toggleShapePanel: PropTypes.any,
};
export default Canvas;
