import React, {Component} from "react";
import List from "@material-ui/core/List";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {Photo, Maximize, CropLandscape, Edit, PanoramaFishEye} from "@material-ui/icons";
import {ListSubheader} from "@material-ui/core";
import socketClientInstance from "../socket/socket";
import constants from "../config/constants";
import {getBase64} from "../utils/readAsDataUrl";
import config from "../config/config";

class ShapePanel extends Component {
    onClickCreateObject = (objectType) => {
        const {pseudo, resolutionHeight, resolutionWidth} = this.props;
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.CREATE_OBJECT,
            from: pseudo,
            to: "server",
            payload: {
                shape: objectType,
                positionX: (resolutionWidth / 2).toString(),
                positionY: (resolutionHeight / 2).toString(),
            },
        });
    };
    onClickCreateObjectImage = () => {
        const maxSize = ["dev", "develop", "development"].includes(config.environment)
            ? 42000
            : 1300;
        const typesAllowed = ["image/png", "image/jpeg", "image/jpg"];
        const file = document.getElementById("myFile").files[0];
        if (file === undefined) {
            return;
        } else if (!typesAllowed.includes(file.type)) {
            alert(`Bad File Type [${file.type}]. File type should be among [png, jpeg, jpg].`);
            return;
        } else if (file.size > maxSize) {
            alert(`File size should not exceed ${maxSize / 1000}ko.`);
            return;
        }
        getBase64(file).then((imageData) => {
            const img = new Image();
            img.onload = () => {
                const {pseudo, resolutionHeight, resolutionWidth} = this.props;
                const maxSize = 300;
                const payload = {shape: "image", description: {srcURI: imageData}};
                if (img.width > img.height) {
                    payload.description.width = maxSize.toString();
                    payload.description.height = (
                        payload.description.width *
                        (img.height / img.width)
                    ).toString();
                } else {
                    payload.description.height = maxSize.toString();
                    payload.description.width = (
                        payload.description.height /
                        (img.height / img.width)
                    ).toString();
                }
                payload.positionX = ((resolutionWidth - payload.description.width) / 2).toString();
                payload.positionY = (
                    (resolutionHeight - payload.description.height) /
                    2
                ).toString();
                socketClientInstance.sendMessage({
                    type: constants.SOCKET_MSG.CREATE_OBJECT,
                    from: pseudo,
                    to: "server",
                    payload,
                });
            };
            img.src = imageData;
        });
    };
    render() {
        return (
            <div style={{maxWidth: 250, backgroundColor: "white"}}>
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
                                Tools
                            </div>
                        </ListSubheader>
                    }></List>
                <Divider />
                <List>
                    {[
                        {
                            title: "HandWriting",
                            component: <Edit />,
                        },
                        {title: "Line", component: <Maximize />},
                        // {title: "Rectangle", component: <CropLandscape />},
                        {title: "Circle", component: <PanoramaFishEye />},
                    ].map((item) => (
                        <ListItem
                            button
                            key={item.title}
                            onClick={() => this.onClickCreateObject(item.title.toLowerCase())}>
                            <ListItemIcon>{item.component}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem
                        button
                        key={"Picture"}
                        onClick={() => {
                            const myInput = document.getElementById("myFile");
                            if (myInput) {
                                myInput.click();
                            }
                        }}>
                        <ListItemIcon>
                            <Photo />
                        </ListItemIcon>
                        <ListItemText primary={"Icon"} />
                    </ListItem>
                    <input
                        type="file"
                        id="myFile"
                        style={{position: "fixed", bottom: "10000px"}}
                        onChange={() => this.onClickCreateObjectImage()}></input>
                </List>
            </div>
        );
    }
}
ShapePanel.propTypes = {
    pseudo: PropTypes.any,
    resolutionWidth: PropTypes.any,
    resolutionHeight: PropTypes.any,
};
export default ShapePanel;
