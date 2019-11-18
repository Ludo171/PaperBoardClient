import React, {Component} from "react";
import PropTypes from "prop-types";

class ShapePanel extends Component {
    changeColor = () => {
        this.props.editCircle();
        alert("color changed");
    };

    render() {
        return (
            <div style={{backgroundColor: "white"}} onClick={this.changeColor}>
                COLOR
            </div>
        );
    }
}
ShapePanel.propTypes = {
    editCircle: PropTypes.object,
};
export default ShapePanel;
