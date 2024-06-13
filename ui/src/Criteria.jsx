import { useState } from "react";
import { Col } from "react-bootstrap";
import { Button } from "@mui/material";
import Markdown from "react-markdown";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Criteria = (props) => {
    let toggleHover = props.toggleHover;
    let item = props.item;
    let addClicked = props.addClicked;
    let visibleClicked = props.visibleClicked;
    const [visible, setVisible] = useState(true);

    return (
        <Col
            lg="3"
            className={`criteria`}
            onMouseEnter={() => toggleHover(item, true)}
            onMouseLeave={() => toggleHover(item, false)}
        >
            <div
                id={`criteria-button-row-${item._id}`}
                className="criteria-definition"
            >
                <div className="criteria-definition-description pt-2">
                    <Markdown>{item.formattedDescription}</Markdown>
                </div>
                <div className="criteria-definition-actions pb-2">
                    <div className="criteria-defintion-actions-fill"></div>
                    <div
                        className={
                            item.actionsVisible
                                ? "cd-actions-show"
                                : "cd-actions-hide"
                        }
                    >
                        <Button variant="outlined" onClick={() => {
                            setVisible(!visible);
                            visibleClicked(item._id.toString(), !visible);
                        }}>
                            {visible ? <VisibilityIcon></VisibilityIcon> : <VisibilityOffIcon></VisibilityOffIcon>}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                addClicked(item._id.toString());
                            }}
                        >
                            Add
                        </Button>

                    </div>
                </div>
            </div>
        </Col>);
}

export default Criteria;