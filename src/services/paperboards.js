import axios from "axios";
import config from "../config/config";

const getAllPaperBoards = () => {
    return axios.get(`${config.rest_url}/paperboards`);
};

const getPaperBoard = (title) => {
    return axios.get(`${config.rest_url}/paperboard?title=${title}`);
};

const createPaperBoard = (title, color) => {
    if (title) {
        if (color) {
            return axios.post(
                `${config.rest_url}/paperboard?title=${title}&backgroundColor=${color}`
            );
        } else {
            return axios.post(`${config.rest_url}/paperboard?title=${title}`);
        }
    }
    return new Promise(function(reject) {
        reject(new Error("Need a title"));
    });
};

export {getAllPaperBoards, createPaperBoard, getPaperBoard};
