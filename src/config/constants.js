const constants = {
    SOCKET_MSG: {
        //   CLIENTS ---> SERVER
        IDENTIFY: "Ask Pseudo",
        JOIN_BOARD: "Join Board",
        LEAVE_BOARD: "Leave Board",
        CREATE_OBJECT: "Create Object",
        EDIT_OBJECT: "Edit Object",
        LOCK_OBJECT: "Lock Object",
        UNLOCK_OBJECT: "Unlock Object",

        //   CLIENTS <---> SERVER
        CHAT_MESSAGE: "Chat Message",
        DELETE_OBJECT: "Delete Object",

        //   SERVER ---> CLIENTS
        IDENTIFY_ANSWER: "Pseudo Request Answer",
        DRAWER_JOIN_BOARD: "New Drawer Joined Board",
        DRAWER_LEFT_BOARD: "Drawer Left Board",
        OBJECT_CREATED: "Object Created",
        OBJECT_EDITED: "Object Edited",
        OBJECT_DELETED: "Object Deleted",
        OBJECT_LOCKED: "Object Locked",
        OBJECT_UNLOCKED: "Object Unlocked",
    },
};

export default constants;
