import React, {Component} from "react";
import "./ColorPicker.scss";
import {colors} from "../utils/colors";
import PropTypes from "prop-types";

const getColorList = (handleColor) => {
    const list = [];
    // eslint-disable-next-line guard-for-in
    for (const color in colors) {
        list.push(
            <div
                className="dropdown-item"
                key={colors[color]}
                onClick={() => handleColor(color, colors[color])}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <p style={{color: colors[color], fontSize: "3em"}}>&#9632;</p>
                </div>
                <hr className="dropdown-divider"></hr>
            </div>
        );
    }
    return list;
};

class ColorPicker extends Component {
    render() {
        const {color, hexColorCode, handleColor} = this.props;
        return (
            <div className="dropdown">
                <div className="dropdown is-hoverable">
                    <div className="dropdown-trigger">
                        <button
                            className="button"
                            aria-haspopup="true"
                            aria-controls="dropdown-menu4">
                            <p
                                style={{
                                    color: hexColorCode,
                                    marginRight: "5%",
                                }}>
                                &#9632;
                            </p>
                            <span>{color ? color : "Background color"}</span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                        <div className="dropdown-content">{getColorList(handleColor)}</div>
                    </div>
                </div>
            </div>
        );
    }
}
ColorPicker.propTypes = {
    color: PropTypes.any,
    hexColorCode: PropTypes.any,
    handleColor: PropTypes.any,
};
export default ColorPicker;
