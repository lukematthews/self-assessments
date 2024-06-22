import { useState, React } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Markdown from 'react-markdown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router';

export const CriteriaPopover = (props) => {

    const criteria = props.criteria ? props.criteria : { title: "", _id: "", formattedDescription: "" };
    const [anchorEl, setAnchorEl] = useState(null);
    let addClicked = props.addClicked;
    let visibleClicked = props.visibleClicked;
    const [visible, setVisible] = useState(true);
    const navigate = useNavigate();


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (

        <div className="criteria-popover">
            <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                {criteria.title}
                {!visible ? <VisibilityOffIcon style={{paddingLeft: "10px"}}/> : <></>}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Markdown>{criteria.formattedDescription}</Markdown>
                <Typography px={2} py={0}>Hide / Show
                    <IconButton variant="contained" color="primary" size="small"
                        onClick={() => {
                            setVisible(!visible);
                            visibleClicked(criteria._id.toString(), !visible);
                        }}>
                        {visible ? <VisibilityIcon></VisibilityIcon> : <VisibilityOffIcon></VisibilityOffIcon>}
                    </IconButton>
                </Typography>

            </Popover>
        </div>
    );
}

export default CriteriaPopover;