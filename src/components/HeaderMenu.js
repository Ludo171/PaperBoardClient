import React, {Component} from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import {ExitToApp, PhotoCamera} from "@material-ui/icons";
import ListOfUsers from "../components/ListOfUsers";
class HeaderMenu extends Component {
    onSave = () => {
        alert("TODO SAVE");
        // TODO
    };

    onImport = () => {
        alert("TODO IMPORT");
        // TODO
    };

    render() {
        const {paperboard, drawers, onQuit} = this.props;
        return (
            <>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#f9a322",
                    }}>
                    {/* PAPERBOARD TITLE */}
                    <p
                        className="title is-1"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            color: "black",
                            marginLeft: "15px",
                            marginTop: "5px",
                            marginBottom: "5px",
                        }}>
                        {paperboard && `-- ${paperboard.title.toString().toUpperCase()} --`}
                    </p>
                    {/* LIST OF CONNECTED USERS */}
                    <ListOfUsers users={drawers} />
                    {/* BOARD ACTION BUTTONS */}
                    <div style={{display: "flex"}}>
                        <Button onClick={this.onSave}>
                            <PhotoCamera />
                        </Button>
                        <Button onClick={onQuit}>
                            <ExitToApp />
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}
HeaderMenu.propTypes = {
    paperboard: PropTypes.any,
    drawers: PropTypes.any,
    onQuit: PropTypes.any,
};
export default HeaderMenu;
