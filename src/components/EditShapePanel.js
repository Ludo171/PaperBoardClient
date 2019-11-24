import React, {Component} from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {ColorLens, Delete} from "@material-ui/icons";
import {Icon, Divider, ListSubheader} from "@material-ui/core";
import ColorPicker from "./ColorPicker";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";
import {colors} from "../utils/colors";
import {lineSize} from "../utils/lineSize";

class EditShapePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLineColorPickerToggled: false,
            isLineWidthPickerToggled: false,
        };
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
            default:
                alert(editionType + " not handled");
        }
    };

    handleColor = (resp) => {
        const {selectedDrawing} = this.props;
        const {value} = resp;

        if (selectedDrawing) {
            selectedDrawing.lineColor = value;
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.EDIT_OBJECT,
                from: selectedDrawing.pseudo,
                to: "server",
                payload: selectedDrawing,
            });
        }
    };

    render() {
        const {isLineColorPickerToggled, isLineWidthPickerToggled} = this.state;
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
                    {isLineColorPickerToggled && (
                        <>
                            <Divider />
                            <ColorPicker
                                color={""}
                                hexColorCode={""}
                                handleClick={this.handleColor}
                                listField={colors}
                                field={"Line color"}
                            />
                        </>
                    )}
                </List>
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
                {isLineColorPickerToggled && (
                    <>
                        <Divider />
                        <ColorPicker
                            color={""}
                            hexColorCode={""}
                            handleClick={this.handleColor}
                            listField={colors}
                            field={"Line color"}
                        />
                    </>
                )}
                {isLineWidthPickerToggled && (
                    <>
                        <Divider />
                        <ColorPicker
                            handleClick={() => console.log("handle")}
                            listField={lineSize}
                            field={"Line width"}
                        />
                    </>
                )}
                <Divider />
                <List>
                    <ListItem
                        button
                        key={"Delete"}
                        onClick={() => this.onClickEditObject("Delete")}
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
