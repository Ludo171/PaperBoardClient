import React, {Component} from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import {ExitToApp, SaveAlt, CloudUpload} from "@material-ui/icons";
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
                        alignItems: "space-between",
                        justifyContent: "space-between",
                        height: "50px",
                        backgroundColor: "#f9a322",
                    }}>
                    {/* PAPERBOARD TITLE */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            color: "black",
                            marginLeft: 15,
                            // marginTop: "0.5em",
                            // marginBottom: "0.5em",
                            fontWeight: "bold",
                            fontSize: "2em",
                        }}>
                        {paperboard && `Paperboard : ${paperboard.title.toString().toUpperCase()}`}
                    </div>
                    {/* LIST OF CONNECTED USERS */}
                    <ListOfUsers users={drawers} />
                    {/* BOARD ACTION BUTTONS */}
                    <div style={{display: "flex"}}>
                        <Button onClick={this.onImport}>
                            <CloudUpload />
                        </Button>
                        <Button onClick={this.onSave}>
                            <SaveAlt />
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
