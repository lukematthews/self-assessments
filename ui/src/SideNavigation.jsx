import { useState, useEffect } from "react";
import { List, ListItemButton, ListItemText, Collapse, ListItem } from "@mui/material";
import { useNavigate } from "react-router";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { FetchCriteriaDescriptions, FetchNavigation } from "./ApiService";
import { purple } from "@mui/material/colors";

const SideNavigation = (props) => {
    const [item, setCriteria] = useState({});
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [itemRefDescriptions, setItemRefDescriptions] = useState([]);

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        FetchNavigation(loadCriteriaResults, criteriaDefinitionsErrorCallback);
    }, []);

    const loadCriteriaResults = (response) => {
        setItemRefDescriptions(response);
    };

    const criteriaDefinitionsErrorCallback = (error) => {
        setLoadFailed(true);
    }


    return (<>
        <List
            style={{backgroundColor: purple[800], color: "white"}}
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader">
            <ListItemButton onClick={handleClick}>
                <ListItemText primary="Criteria" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {itemRefDescriptions.map((item) => {
                    return (<div key={item._id}></div>);
                })}

                <List component="div" disablePadding>
                    {itemRefDescriptions.map((item) => {
                        return (
                            <ListItem key={item._id}
                                secondaryAction={
                                    <ListItemText primary={item.assessmentCount}></ListItemText>
                                }
                                disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => {
                                    navigate(`/criteria/${item.title}`)
                                }}
                                >
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Collapse>
        </List>
        <ListItemButton key={item._id} onClick={() => {
            navigate(`/all`)
        }}>
            <ListItemText primary="View All" />
        </ListItemButton>
        <List>
        </List></>);
}

export default SideNavigation;