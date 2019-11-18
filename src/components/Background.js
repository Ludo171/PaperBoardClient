import React, {Component} from "react";
import * as backgroundImage from "../assets/background-image2.jpg";
import PropTypes from "prop-types";
import "./Background.scss";

class Background extends Component {
    resizeImageToFill(e) {
        let targetWidth;
        let targetHeight;
        const container = document.getElementById("page");
        const containerProp = container.clientHeight / container.clientWidth;
        const img = document.getElementById("background-image");
        const imgProp = img.height / img.width;

        if (containerProp > imgProp) {
            targetHeight = container.clientHeight;
            targetWidth = targetHeight / imgProp;
        } else {
            targetWidth = container.clientWidth;
            targetHeight = targetWidth * imgProp;
        }

        img.style.width = `${Math.floor(targetWidth)}px`;
        img.style.height = `${Math.floor(targetHeight)}px`;
    }
    componentDidMount() {
        window.addEventListener("resize", this.resizeImageToFill);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeImageToFill);
    }
    render() {
        return (
            <div id="page">
                <img
                    id="background-image"
                    src={backgroundImage}
                    onLoad={this.resizeImageToFill}
                    alt="background"></img>
                {this.props.children}
            </div>
        );
    }
}
Background.propTypes = {
    children: PropTypes.any,
};
export default Background;
