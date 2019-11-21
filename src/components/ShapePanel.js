import React from "react";
import List from "@material-ui/core/List";
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

const shapePanel = (createTextField, createCircle) => (
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
            <ListItem button key={"Text"} onClick={createTextField}>
                <ListItemIcon>
                    <TextFieldIcon />
                </ListItemIcon>
                <ListItemText primary={"Text"} />
            </ListItem>
        </List>
        <Divider />
        <List>
            {[
                {title: "Line", component: <Maximize />},
                {title: "Rectangle", component: <CropLandscape />},
                {title: "Circle", component: <PanoramaFishEye />, method: createCircle},
                {
                    title: "Draw",
                    component: <Edit />,
                },
                {
                    title: "Triangle",
                    component: (
                        <Icon>
                            <img src={require("../assets/triangle.png")} alt="" />
                        </Icon>
                    ),
                },
            ].map((item) => (
                <ListItem button key={item.title} onClick={item.method}>
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

export default shapePanel;
