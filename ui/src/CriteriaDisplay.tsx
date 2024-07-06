import React, { useState } from "react";
import { Col } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import Markdown from "react-markdown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useNavigate } from "react-router";
import Criteria from "./model/Criteria";
import { CriteriaUI } from "./model/ui/DisplayTypes";

interface CriteriaDisplayProps {
  toggleHover: (item: CriteriaUI, visible: boolean) => void;
  item: Criteria;
  addClicked: (id: string) => void;
  visibleClicked: (id: string, visible: boolean) => void;
}

const CriteriaDisplay: React.FC<CriteriaDisplayProps> = (props) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <Col lg="3" className={`criteria`} onMouseEnter={() => props.toggleHover(props.item as CriteriaUI, true)} onMouseLeave={() => props.toggleHover(props.item as CriteriaUI, false)}>
      <div id={`criteria-button-row-${props.item._id}`} className="criteria-definition">
        <div className="criteria-definition-description pt-2">
          <Markdown>{props.item.formattedDescription}</Markdown>
        </div>
        <div className="criteria-definition-actions pb-2">
          <div className="criteria-defintion-actions-fill"></div>
          <div>
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setVisible(!visible);
                props.visibleClicked(props.item._id.toString(), !visible);
              }}
            >
              {visible ? <VisibilityIcon></VisibilityIcon> : <VisibilityOffIcon></VisibilityOffIcon>}
            </IconButton>
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                navigate(`/criteria/${props.item.title}`);
              }}
            >
              <OpenInFullIcon></OpenInFullIcon>
            </IconButton>
            <IconButton
              color="success"
              onClick={() => {
                props.addClicked(props.item._id.toString());
              }}
            >
              <AddIcon></AddIcon>
            </IconButton>
          </div>
        </div>
      </div>
    </Col>
  );
}

export default CriteriaDisplay;