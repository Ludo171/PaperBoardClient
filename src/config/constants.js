const constants = {
    SOCKET_MSG: {
        //   CLIENTS ---> SERVER
        JOIN_BOARD: "Join Board",
        LEAVE_BOARD: "Leave Board",
        CREATE_OBJECT: "Create Object",
        EDIT_OBJECT: "Edit Object",
        LOCK_OBJECT: "Lock Object",
        UNLOCK_OBJECT: "Unlock Object",

        //   CLIENTS <---> SERVER
        CHAT_MESSAGE: "Chat Message",
        ASK_DELETION: "Ask to Delete",

        //   SERVER ---> CLIENTS
        OBJECT_CREATED: "Object Created",
        OBJECT_EDITED: "Object Edited",
        OBJECT_DELETED: "Object Deleted",
        DRAWER_CONNECTED: "New Drawer Connected",
        DRAWER_DISCONNECTED: "Drawer Disconnected",
    },
};

export default constants;
