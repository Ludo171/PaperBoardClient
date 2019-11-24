import React, {Component} from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {ColorLens, Delete} from "@material-ui/icons";
import {Icon, Divider, ListSubheader} from "@material-ui/core";
import ColorPicker from "./Picker";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import {colors} from "../utils/colors";
import {lineSize} from "../utils/lineSize";
import {lineStyles} from "../utils/lineStyle";

class EditShapePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLineColorPickerToggled: false,
            isLineWidthPickerToggled: false,
            isLineStylePickerToggled: false,
            isFillColorPickerToggled: false,
        };
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.selectedDrawing !== this.props.selectedDrawing &&
            !nextProps.selectedDrawing
        ) {
            this.setState({
                isLineColorPickerToggled: false,
                isLineWidthPickerToggled: false,
                isLineStylePickerToggled: false,
                isFillColorPickerToggled: false,
            });
        }
    }

    onClickEditObject = (editionType) => {
        switch (editionType) {
            case "Color":
                this.setState((prevState) => ({
                    isLineColorPickerToggled: !prevState.isLineColorPickerToggled,
                }));
                break;
            case "Width":
                this.setState((prevState) => ({
                    isLineWidthPickerToggled: !prevState.isLineWidthPickerToggled,
                }));
                break;
            case "LineStyle":
                this.setState((prevState) => ({
                    isLineStylePickerToggled: !prevState.isLineStylePickerToggled,
                }));
                break;
            case "FillColor":
                this.setState((prevState) => ({
                    isFillColorPickerToggled: !prevState.isFillColorPickerToggled,
                }));
                break;
            default:
                alert(editionType + " not handled");
        }
    };

    handleColor = (resp) => {
        const {selectedDrawing} = this.props;
        const {value} = resp;
        const payload = selectedDrawing;
        if (payload) {
            payload.lineColor = value;
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.EDIT_OBJECT,
                from: payload.pseudo,
                to: "server",
                payload: payload,
            });
        }
    };

    handleLineWidth = (resp) => {
        const {selectedDrawing} = this.props;
        const {item} = resp;
        const payload = selectedDrawing;
        if (payload) {
            payload.lineWidth = item;
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.EDIT_OBJECT,
                from: payload.pseudo,
                to: "server",
                payload: payload,
            });
        }
    };

    handleLineStyle = (resp) => {
        const {selectedDrawing} = this.props;
        const {item} = resp;
        const payload = selectedDrawing;
        if (payload) {
            payload.lineStyle = item;
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.EDIT_OBJECT,
                from: payload.pseudo,
                to: "server",
                payload: payload,
            });
        }
    };
    handleColorFillColor = (resp) => {
        const {selectedDrawing} = this.props;
        const {value} = resp;
        const payload = selectedDrawing;
        if (payload) {
            payload.fillColor = value;
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.EDIT_OBJECT,
                from: payload.pseudo,
                to: "server",
                payload: payload,
            });
        }
    };

    handleDeleteObject = () => {
        const {selectedDrawing} = this.props;
        const payload = selectedDrawing;
        if (payload) {
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.DELETE_OBJECT,
                from: payload.pseudo,
                to: "server",
                payload: payload,
            });
        }
    };

    render() {
        const {
            isLineColorPickerToggled,
            isLineWidthPickerToggled,
            isLineStylePickerToggled,
            isFillColorPickerToggled,
        } = this.state;
        const {selectedDrawing} = this.props;
        return (
            <div style={{maxWidth: 360, backgroundColor: "white"}}>
                <List
                    component="nav"
                    aria-label="main mailbox folders"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "2em",
                                }}>
                                Edit
                            </div>
                        </ListSubheader>
                    }>
                    <ListItem
                        button
                        key={"Color"}
                        onClick={() => this.onClickEditObject("Color")}
                        disabled={!selectedDrawing}>
                        <ListItemIcon>
                            <ColorLens />
                        </ListItemIcon>
                        <ListItemText primary={"Color"} />
                    </ListItem>
                </List>
                {isLineColorPickerToggled && (
                    <>
                        <ColorPicker
                            color={""}
                            hexColorCode={""}
                            handleClick={this.handleColor}
                            listField={colors}
                            field={"Line color"}
                            type={"color"}
                        />
                    </>
                )}
                <List>
                    <ListItem
                        button
                        key={"FillColor"}
                        onClick={() => this.onClickEditObject("FillColor")}
                        disabled={!selectedDrawing}>
                        <ListItemIcon>
                            <Icon>
                                <img src={require("../assets/fillColor.png")} alt="" />
                            </Icon>
                        </ListItemIcon>
                        <ListItemText primary={"Fill Color"} />
                    </ListItem>
                </List>
                {isFillColorPickerToggled && (
                    <>
                        <ColorPicker
                            color={""}
                            hexColorCode={""}
                            handleClick={this.handleColorFillColor}
                            listField={colors}
                            field={"Fill color"}
                            type={"color"}
                        />
                    </>
                )}
                <List>
                    <ListItem
                        button
                        key={"Width"}
                        onClick={() => this.onClickEditObject("Width")}
                        disabled={!selectedDrawing}>
                        <ListItemIcon>
                            <Icon>
                                <img src={require("../assets/width.png")} alt="" />
                            </Icon>
                        </ListItemIcon>
                        <ListItemText primary={"Width"} />
                    </ListItem>
                </List>
                {isLineWidthPickerToggled && (
                    <>
                        <ColorPicker
                            color={""}
                            hexColorCode={""}
                            handleClick={this.handleLineWidth}
                            listField={lineSize}
                            field={"Line width"}
                        />
                    </>
                )}
                <List>
                    <ListItem
                        button
                        key={"LineStyle"}
                        onClick={() => this.onClickEditObject("LineStyle")}
                        disabled={!selectedDrawing}>
                        <ListItemIcon>
                            <Icon>
                                <img src={require("../assets/lineStyle.png")} alt="" />
                            </Icon>
                        </ListItemIcon>
                        <ListItemText primary={"Line Style"} />
                    </ListItem>
                </List>
                {isLineStylePickerToggled && (
                    <>
                        <ColorPicker
                            color={""}
                            hexColorCode={""}
                            handleClick={this.handleLineStyle}
                            listField={lineStyles}
                            field={"Line style"}
                        />
                    </>
                )}
                <Divider />
                <List>
                    <ListItem
                        button
                        key={"Delete"}
                        onClick={this.handleDeleteObject}
                        disabled={!selectedDrawing}>
                        <ListItemIcon>
                            <Delete />
                        </ListItemIcon>
                        <ListItemText primary={"Delete"} />
                    </ListItem>
                </List>
            </div>
        );
    }
}
EditShapePanel.propTypes = {
    onClickEditObject: PropTypes.any,
    selectedDrawing: PropTypes.any,
};
export default EditShapePanel;
