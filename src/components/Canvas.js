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
                    }}
                />
                <div onClick={this.selectShape}>test select shape</div>
            </>
        );
    }
}
Canvas.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    toggleShapePanel: PropTypes.object,
};
export default Canvas;
