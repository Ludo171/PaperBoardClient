const constants = {
    SOCKET_MSG: {
        //   CLIENTS ---> SERVER
        IDENTIFY: "Ask Pseudo",
        GET_BOARD: "Get Board",
        GET_ALL_BOARDS: "Get All Boards",
        CREATE_BOARD:"Create Board",
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
        ANSWER_GET_BOARD: "Answer Get Board",
        ANSWER_GET_ALL_BOARDS: "Answer Get All Boards",
        ANSWER_CREATE_BOARD: "Answer Create Board",
        DRAWER_JOIN_BOARD: "New Drawer Joined Board",
        DRAWER_LEFT_BOARD: "Drawer Left Board",
        DRAWER_DISCONNECTED: "Drawer Disconnected",
        OBJECT_CREATED: "Object Created",
        OBJECT_EDITED: "Object Edited",
        OBJECT_DELETED: "Object Deleted",
        OBJECT_LOCKED: "Object Locked",
        OBJECT_UNLOCKED: "Object Unlocked",
    },
};

export default constants;
