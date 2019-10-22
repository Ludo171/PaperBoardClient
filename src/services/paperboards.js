import axios from "axios";
import config from "../config/config";

const getAllPaperBoards = () => {
    return axios.get(`${config.hostname}:${config.http_port}/paperboards`);
};

const getPaperBoard = (title) => {
    return axios.get(`${config.hostname}:${config.http_port}/paperboard?title=${title}`);
};

const createPaperBoard = (title, color, backgroundImageName) => {
    if (title) {
        if (color) {
            return axios.post(
                `${config.hostname}:${config.http_port}/paperboard?title=${title}&backgroundColor=${color}`
            );
        } else if (backgroundImageName) {
            return axios.post(
                `${config.hostname}:${config.http_port}/paperboard?title=${title}&backgroundImageName=${backgroundImageName}`
            );
        } else {
            return axios.post(`${config.hostname}:${config.http_port}/paperboard?title=${title}`);
        }
    }
    return new Promise(function(reject) {
        reject(new Error("Need a title"));
    });
};

const uploadBgImage = (paperboardName, data) => {
    return axios.post(
        `${config.hostname}:${config.http_port}/paperboard/upload/image?paperboardName=${paperboardName}`,
        data,
        {
            headers: {},
        }
    );
};

const downloadBgImage = (paperboardName) => {
    return axios.get(`${config.hostname}:${config.http_port}/paperboard/download/image`, {
        paperboardName,
    });
};

export {getAllPaperBoards, createPaperBoard, getPaperBoard, uploadBgImage, downloadBgImage};
