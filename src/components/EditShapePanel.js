import React, {Component} from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {ColorLens} from "@material-ui/icons";
import {Icon} from "@material-ui/core";

class EditShapePanel extends Component {
    render() {
        const {onClickEditObject} = this.props;
        return (
            <div style={{maxWidth: 360, backgroundColor: "white"}}>
                <List component="nav" aria-label="main mailbox folders">
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
                            onClick={() => onClickEditObject(item.title)}>
                            <ListItemIcon>{item.component}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}
EditShapePanel.propTypes = {
    onClickEditObject: PropTypes.any,
};
export default EditShapePanel;
