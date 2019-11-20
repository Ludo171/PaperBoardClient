import React, {Component} from "react";
import PropTypes from "prop-types";
import "./Background.scss";

class Background extends Component {
    componentDidMount() {
        this.backgroundImg = new Image();
        this.backgroundImg.addEventListener("load", () => this.refreshBackground());
        this.backgroundImg.src = this.props.imgSrc;
        window.addEventListener("resize", () => this.refreshBackground());
    }
    componentWillUnmount() {
        this.backgroundImg.removeEventListener("load", () => this.refreshBackground());
        window.removeEventListener("resize", () => this.refreshBackground());
    }
    refreshBackground() {
        const pageContainer = document.getElementById("page-container");
        const canvas = document.getElementById("background-canvas");
        const ctx = canvas.getContext("2d");
        canvas.style.width = `${pageContainer.clientWidth}px`;
        canvas.width = pageContainer.clientWidth;
        canvas.style.height = `${pageContainer.clientHeight}px`;
        canvas.height = pageContainer.clientHeight;
        const canvasW = canvas.width;
        const canvasH = canvas.height;
        const canvasProp = canvasH / canvasW;

        const img = this.backgroundImg;
        const imgW = img.width;
        const imgH = img.height;
        const imgProp = imgH / imgW;

        let srcX;
        let srcY;
        let srcW;
        let srcH;
        if (canvasProp > imgProp) {
            srcH = imgH;
            srcW = srcH / canvasProp;
            srcX = (imgW - srcW) / 2;
            srcY = 0;
        } else {
            srcW = imgW;
            srcH = srcW * canvasProp;
            srcX = 0;
            srcY = (imgH - srcH) / 2;
        }
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvasW, canvasH);
    }
    addMinimumStyleAttributes(style) {
        const defaultStyle = {
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: "100%",
        };

        if (style === undefined) {
            style = defaultStyle;
        } else {
            const keys = Object.keys(defaultStyle);
            for (let i = 0; i < keys.length; i++) {
                if (!style.hasOwnProperty(keys[i])) {
                    style[keys[i]] = defaultStyle[keys[i]];
                }
            }
        }
    }
    render() {
        const {customStyle} = this.props;
        this.addMinimumStyleAttributes(customStyle);
        return (
            <div id="page-container" style={customStyle}>
                <canvas
                    id="background-canvas"
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        height: "100%",
                        width: "100%",
                        zIndex: -1,
                    }}
                    alt="background"></canvas>
                {this.props.children}
            </div>
        );
    }
}
Background.propTypes = {
    children: PropTypes.any,
    customStyle: PropTypes.any,
    imgSrc: PropTypes.any,
};
export default Background;
