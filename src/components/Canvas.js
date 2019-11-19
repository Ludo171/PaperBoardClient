import React, {Component} from "react";
import PropTypes from "prop-types";

class Canvas extends Component {
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

    render() {
        const {width, height} = this.props;
        return (
            <>
                <canvas
                    style={{
                        width,
                        height,
                        backgroundColor: "white",
                        marginLeft: 15,
                        marginRight: 15,
                    }}
                />
                <div onClick={this.selectShape} style={{backgroundColor: "white"}}>
                    test select shape
                </div>
            </>
        );
    }
}
Canvas.propTypes = {
    width: PropTypes.any,
    height: PropTypes.any,
    toggleShapePanel: PropTypes.any,
};
export default Canvas;
