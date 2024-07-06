import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Markdown from "react-markdown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Criteria from "./model/Criteria";
import AddIcon from "@mui/icons-material/Add";

interface CriteriaPopoverProps {
  visibleClicked: (id: string, visible: boolean) => void;
  addClicked: (id: string) => void;
  criteria: Criteria;
}

const CriteriaPopover: React.FC<CriteriaPopoverProps> = (props) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [visible, setVisible] = useState(true);

  const handleClick = (event?: React.MouseEvent<Element>) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="criteria-popover">
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        {props.criteria.title}
        {!visible ? <VisibilityOffIcon style={{ paddingLeft: "10px" }} /> : <></>}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        style={{width: "50%"}}
      >
        <div style={{padding: "10px" }}>
          <Markdown>{props.criteria.formattedDescription}</Markdown>
          <Typography px={2}></Typography>
          <Typography px={2} py={0}>
            Hide / Show
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setVisible(!visible);
                props.visibleClicked(props.criteria._id.toString(), !visible);
              }}
            >
              {visible ? <VisibilityIcon></VisibilityIcon> : <VisibilityOffIcon></VisibilityOffIcon>}
            </IconButton>
            <IconButton
              color="success"
              onClick={() => {
                props.addClicked(props.criteria._id.toString());
              }}
            >
              <AddIcon></AddIcon>
            </IconButton>
          </Typography>
        </div>
      </Popover>
    </div>
  );
};

export default CriteriaPopover;
