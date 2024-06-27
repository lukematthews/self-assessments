import { useState } from "react";
import { Col } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import Markdown from "react-markdown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useNavigate } from "react-router";
import Criteria from "./model/Criteria";

export default function CriteriaDisplay({
  toggleHover,
  item,
  addClicked,
  visibleClicked,
}: {
  toggleHover: (item: CriteriaUI, visible: boolean) => void;
  item: Criteria;
  addClicked: (id: string) => void;
  visibleClicked: (id: string, visible: boolean) => void;
}) {
//   let toggleHover = props.toggleHover;
//   let item = props.item;
//   let addClicked = props.addClicked;
//   let visibleClicked = props.visibleClicked;
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <Col lg="3" className={`criteria`} onMouseEnter={() => toggleHover(item, true)} onMouseLeave={() => toggleHover(item, false)}>
      <div id={`criteria-button-row-${item._id}`} className="criteria-definition">
        <div className="criteria-definition-description pt-2">
          <Markdown>{item.formattedDescription}</Markdown>
        </div>
        <div className="criteria-definition-actions pb-2">
          <div className="criteria-defintion-actions-fill"></div>
          <div>
            <IconButton
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setVisible(!visible);
                visibleClicked(item._id.toString(), !visible);
              }}
            >
              {visible ? <VisibilityIcon></VisibilityIcon> : <VisibilityOffIcon></VisibilityOffIcon>}
            </IconButton>
            <IconButton
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                navigate(`/criteria/${item.title}`);
              }}
            >
              <OpenInFullIcon></OpenInFullIcon>
            </IconButton>
            <IconButton
              color="success"
              variant="contained"
              onClick={() => {
                addClicked(item._id.toString());
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
