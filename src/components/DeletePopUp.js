import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import socketClientInstance from "../socket/socket";
import constants from "../config/constants";

class DeletePopUp extends Component {
    agreeDeletion = () => {
        const {msg, handleObjectDelete} = this.props;
        handleObjectDelete();
        const payload = {};
        payload.pseudo = msg.to;
        payload.board = msg.payload.board;
        payload.drawingId = msg.payload.drawingId;
        if (payload) {
            socketClientInstance.sendMessage({
                type: constants.SOCKET_MSG.DELETE_OBJECT,
                from: msg.to,
                to: "server",
                payload: payload,
            });
        }
    };
    render() {
        const {msg, handleObjectDelete} = this.props;
        return (
            <div
                style={{
                    display: "flex",
                    width: "70%",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    paddingTop: "1em",
                    paddingBottom: "1em",
                    border: "2px solid #f9a322",
                }}>
                <div
                    style={{
                        fontSize: "2em",
                        textAlign: "center",
                    }}>{`${msg.from} want to delete one ${msg.payload.type} you have created`}</div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "100%",
                    }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CancelIcon />}
                        onClick={handleObjectDelete}>
                        Disagree
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DeleteIcon />}
                        onClick={this.agreeDeletion}>
                        Agree
                    </Button>
                </div>
            </div>
        );
    }
}
DeletePopUp.propTypes = {
    msg: PropTypes.any,
    handleObjectDelete: PropTypes.any,
};
export default DeletePopUp;
