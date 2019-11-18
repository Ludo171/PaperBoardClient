import React, {Component} from "react";
import PropTypes from "prop-types";
const color = require("string-to-color");

class ListOfUsers extends Component {
    render() {
        const {users} = this.props;
        console.log({users});

        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                {users.map((user, id) => (
                    <div
                        key={id}
                        style={{
                            backgroundColor: color(user),
                            width: 24,
                            height: 24,
                            borderRadius: 12,
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
    users: PropTypes.object,
};
export default ListOfUsers;
