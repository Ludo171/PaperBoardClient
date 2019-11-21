import React, {Component} from "react";
import List from "@material-ui/core/List";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
    TextFields as TextFieldIcon,
    Photo,
    Maximize,
    CropLandscape,
    Edit,
    PanoramaFishEye,
} from "@material-ui/icons";
import {Icon, ListSubheader} from "@material-ui/core";
import socketClientInstance from "../services/socket";
import constants from "../config/constants";

class ShapePanel extends Component {
    onClickCreateObject = (objectType) => {
        const {pseudo} = this.props;
        // alert("create " + objectType + pseudo);
        // switch (objectType) {
        //     case "Text":
        //         console.log("text");
        //         break;
        //     case "Circle":
        socketClientInstance.sendMessage({
            type: constants.SOCKET_MSG.CREATE_OBJECT,
            from: pseudo,
            to: "server",
            payload: {shape: objectType},
        });
        // break;
        // }
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
                    }>
                    <ListItem button key={"Text"} onClick={() => this.onClickCreateObject("Text")}>
                        <ListItemIcon>
                            <TextFieldIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Text"} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {[
                        {
                            title: "Draw",
                            component: <Edit />,
                        },
                        {title: "Line", component: <Maximize />},
                        {title: "Rectangle", component: <CropLandscape />},
                        {title: "Circle", component: <PanoramaFishEye />},
                        {
                            title: "Triangle",
                            component: (
                                <Icon>
                                    <img src={require("../assets/triangle.png")} alt="" />
                                </Icon>
                            ),
                        },
                    ].map((item) => (
                        <ListItem
                            button
                            key={item.title}
                            onClick={() => this.onClickCreateObject(item.title)}>
                            <ListItemIcon>{item.component}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem button key={"Picture"}>
                        <ListItemIcon>
                            <Photo />
                        </ListItemIcon>
                        <ListItemText primary={"Picture"} />
                    </ListItem>
                </List>
            </div>
        );
    }
}
ShapePanel.propTypes = {
    pseudo: PropTypes.any,
};
export default ShapePanel;
