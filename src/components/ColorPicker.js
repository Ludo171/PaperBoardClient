import React, {Component} from "react";
import "./ColorPicker.scss";
import PropTypes from "prop-types";

const getColorList = (handleClick, listField) => {
    const list = [];
    // eslint-disable-next-line guard-for-in
    for (const color in listField) {
        list.push(
            <div
                className="dropdown-item"
                key={listField[color]}
                onClick={() => handleClick({item: color, value: listField[color]})}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <p style={{color: listField[color], fontSize: "3em"}}>&#9632;</p>
                </div>
                <hr className="dropdown-divider"></hr>
            </div>
        );
    }
    return list;
};
// type : color or number
class ColorPicker extends Component {
    render() {
        const {color, hexColorCode, handleClick, listField, field} = this.props;
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
                            <span>{color ? color : field}</span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                        <div className="dropdown-content">
                            {getColorList(handleClick, listField)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ColorPicker.propTypes = {
    color: PropTypes.any,
    hexColorCode: PropTypes.any,
    handleClick: PropTypes.any,
    listField: PropTypes.any,
    field: PropTypes.any,
    type: PropTypes.any,
};
export default ColorPicker;
