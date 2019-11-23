import React, {Component} from "react";
import PropTypes from "prop-types";
const color = require("string-to-color");

class ListOfUsers extends Component {
    render() {
        const {users} = this.props;

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                {users &&
                    users.map((user, id) => (
                        <div
                            key={id}
                            style={{
                                backgroundColor: color(user),
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                            }}>
                            {user[0]}
                        </div>
                    ))}
            </div>
        );
    }
}
ListOfUsers.propTypes = {
    users: PropTypes.any,
};
export default ListOfUsers;
