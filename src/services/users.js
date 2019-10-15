import axios from "axios";
import config from "../config/config";

const postUser = (pseudo) => {
    return axios.post(`${config.hostname}:${config.http_port}/user?pseudo=${pseudo}`);
};

export {postUser};
