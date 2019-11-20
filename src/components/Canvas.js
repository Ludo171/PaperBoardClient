import React, {Component} from "react";
import PropTypes from "prop-types";
import ReactResizeDetector from "react-resize-detector";

class Canvas extends Component {
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
        this.count += 1;
        console.log(`Canvas resized ${this.count} times !`);
        const canvas = document.getElementById("canvascanvas");
        console.log(this.props.sizeRatio);
        console.log(canvas.style);
        console.log(
            `canvas.style.height:${canvas.height}, canvas.style.width:${canvas.style.width}`
        );
        canvas.style.height = `${canvas.style.width * this.props.sizeRatio}px`;
    }

    render() {
        return (
            <div
                id="paperboard-canvas"
                style={{
                    flex: 1,
                    height: "100%",
                    backgroundColor: "blue",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                <ReactResizeDetector handleWidth onResize={() => this._onResize()} />
                <canvas
                    ref={(el) => (this.canvas = el)}
                    id="canvascanvas"
                    style={{
                        width: "100%",
                        backgroundColor: "white",
                        // marginLeft: 15,
                        // marginRight: 15,
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
