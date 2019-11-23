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

class EditShapePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isColorPickerToggled: false,
        };
    }

    onClickEditObject = (editionType) => {
        switch (editionType) {
            case "Color":
                this.setState((prevState) => ({
                    isColorPickerToggled: !prevState.isColorPickerToggled,
                }));
                break;
            default:
                alert(editionType + " not handled");
        }
    };

    handleColor = (_, hexColorCode) => {
        const {selectedDrawing} = this.props;

        if (selectedDrawing) {
            selectedDrawing.lineColor = hexColorCode;
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.EDIT_OBJECT,
                from: selectedDrawing.pseudo,
                to: "server",
                payload: selectedDrawing,
            });
        }
    };

    render() {
        const {isColorPickerToggled} = this.state;
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
                    {[
                        {title: "Color", component: <ColorLens />},
                        {
                            title: "Width",
                            component: (
                                <Icon>
                                    <img src={require("../assets/width.png")} alt="" />
                                </Icon>
                            ),
                        },
                    ].map((item) => (
                        <ListItem
                            button
                            key={item.title}
                            onClick={() => this.onClickEditObject(item.title)}
                            disabled={!selectedDrawing}>
                            <ListItemIcon>{item.component}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
                {isColorPickerToggled && (
                    <>
                        <Divider />
                        <ColorPicker color={""} hexColorCode={""} handleColor={this.handleColor} />
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
