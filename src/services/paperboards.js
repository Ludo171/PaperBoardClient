import axios from "axios";
import config from "../config/config";

const getAllPaperBoards = () => {
    return axios.get(`${config.hostname}:${config.http_port}/paperboards`);
};

const getPaperBoard = (title) => {
    return axios.get(`${config.hostname}:${config.http_port}/paperboard?title=${title}`);
};

const createPaperBoard = (title, color) => {
    if (title) {
        if (color) {
            return axios.post(
                `${config.hostname}:${config.http_port}/paperboard?title=${title}&backgroundColor=${color}`
            );
        } else {
            return axios.post(`${config.hostname}:${config.http_port}/paperboard?title=${title}`);
        }
    }
    return new Promise(function(reject) {
        reject(new Error("Need a title"));
    });
};

export {getAllPaperBoards, createPaperBoard, getPaperBoard};
