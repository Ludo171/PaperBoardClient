import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {createPaperBoard, uploadBgImage} from "../services/paperboards";
import PropTypes from "prop-types";
import {colors} from "../utils/colors";
import "./CreateBoardPage.scss";
import Background from "../components/Background";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const getColorList = (handleColor) => {
    const list = [];
    // eslint-disable-next-line guard-for-in
    for (const color in colors) {
        list.push(
            <div
                className="dropdown-item"
                key={colors[color]}
                onClick={() => handleColor(color, colors[color])}>
                <div className="dropdown-item-text">
                    <p style={{color: colors[color]}}>&#9632;</p>
                    <p>{color}</p>
                </div>
                <hr className="dropdown-divider"></hr>
            </div>
        );
    }
    return list;
};

class CreateBoardPage extends Component {
    state = {
        title: "",
        color: "",
        hexColorCode: "",
        BackgroundImageTitle: "",
        isBackgroundColor: false,
        isBackgroundImage: false,
        selectedFile: null,
    };

    defaultBoardTitle = "default-paper-board";

    handleTitleChanges = (event) => {
        this.setState({title: event.target.value});
    };

    handleColor = (color, hexColorCode) => {
        this.setState({color, hexColorCode});
    };

    handleBgImage = (e) => {
        e.preventDefault();
        this.setState({
            selectedFile: e.target.files[0],
        });
        console.log(e.target.files[0]);
    };

    onCreatePaperBoard = () => {
        const {title, color, selectedFile} = this.state;
        console.log(title, color, selectedFile);
        createPaperBoard(title, color, selectedFile ? selectedFile.name : null)
            .then((response) => {
                this.props.history.push({
                    pathname: "/paperboard/" + response.data.title,
                    state: {detail: response.data},
                });
                console.log(response.data);
            })
            .catch(function(error) {
                if (error.response.status === 409) {
                    alert(
                        "A board with the name " +
                            title +
                            " already exists. Plesae consider another name"
                    );
                }
            });
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", this.state.selectedFile);
            uploadBgImage(title, formData).then(() => {
                alert("File uploaded successfully.");
            });
        }
    };

    handleSwitch = (name) => (event) => {
        if (name === "bgColor") {
            this.setState({
                isBackgroundColor: event.target.checked,
                isBackgroundImage: false,
            });
        } else {
            this.setState({
                isBackgroundColor: false,
                isBackgroundImage: event.target.checked,
            });
        }
        this.setState({color: "", hexColorCode: ""});
    };

    render() {
        const {color, hexColorCode, isBackgroundColor, isBackgroundImage} = this.state;
        return (
            <Background>
                <>
                    <div className="title is-1 has-text-success">
                        <h1>Set up your board and create it !</h1>
                    </div>
                    <div className="card">
                        <div className="card-content">
                            <div className="field">
                                <p className="control has-icons-left">
                                    <input
                                        type="text"
                                        className="input is-large"
                                        placeholder="Title - required"
                                        value={this.state.title}
                                        onChange={this.handleTitleChanges}></input>
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-lock"></i>
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isBackgroundColor}
                                                onChange={this.handleSwitch("bgColor")}
                                                value="checkedA"
                                            />
                                        }
                                        label="Background Color"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isBackgroundImage}
                                                onChange={this.handleSwitch("bgImage")}
                                                value="checkedB"
                                                color="primary"
                                            />
                                        }
                                        label="Background Image"
                                    />
                                </FormGroup>
                            </div>
                            <div className="empty-div">
                                {isBackgroundColor ? (
                                    <div className="dropdown">
                                        <div className="dropdown is-hoverable">
                                            <div className="dropdown-trigger">
                                                <button
                                                    className="button"
                                                    aria-haspopup="true"
                                                    aria-controls="dropdown-menu4">
                                                    <p
                                                        style={{
                                                            color: hexColorCode,
                                                            marginRight: "5%",
                                                        }}>
                                                        &#9632;
                                                    </p>
                                                    <span>
                                                        {color ? color : "Background color"}
                                                    </span>
                                                </button>
                                            </div>
                                            <div
                                                className="dropdown-menu"
                                                id="dropdown-menu4"
                                                role="menu">
                                                <div className="dropdown-content">
                                                    {getColorList(this.handleColor)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {isBackgroundImage ? (
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group files color">
                                                    <label>Upload Your File </label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        name="file"
                                                        onChange={this.handleBgImage}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button
                                className="button is-success is-large"
                                onClick={this.onCreatePaperBoard}>
                                Create !
                            </button>
                        </p>
                    </div>
                </>
            </Background>
        );
    }
}

CreateBoardPage.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withRouter(CreateBoardPage);
