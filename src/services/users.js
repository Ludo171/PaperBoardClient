import axios from "axios";
import config from "../config/config";

const postUser = (pseudo) => {
    return axios.post(`${config.rest_url}/user?pseudo=${pseudo}`);
};

export {postUser};
