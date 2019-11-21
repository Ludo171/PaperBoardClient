import React, {Component} from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {ColorLens, Delete} from "@material-ui/icons";
import {Icon, Divider, ListSubheader} from "@material-ui/core";

class EditShapePanel extends Component {
    onClickEditObject = (editionType) => {
        alert("edit " + editionType);
        // this.canvas.editShape();
    };
    render() {
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
                            onClick={() => this.onClickEditObject(item.title)}>
                            <ListItemIcon>{item.component}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem
                        button
                        key={"Delete"}
                        onClick={() => this.onClickEditObject("Delete")}>
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
};
export default EditShapePanel;
