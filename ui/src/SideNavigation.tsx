import { useState, useEffect } from "react";
import { List, ListItemButton, ListItemText, Collapse, ListItem } from "@mui/material";
import { useNavigate } from "react-router";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ApiService } from "./ApiService";
import { purple } from "@mui/material/colors";
import { NavigationCriteria } from "./model/ui/DisplayTypes";
import { sortByString } from "./model/ui/utils";
import { useSelector } from "react-redux";
import { AssessmentModificationProps } from "./redux/AssessmentReducer";

const SideNavigation:React.FC<{}> = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [itemRefDescriptions, setItemRefDescriptions] = useState<NavigationCriteria[]>([]);
    const [_loadFailed, setLoadFailed] = useState(false);

    const modified = useSelector<AssessmentModificationProps>(state => state.modified);
    const deleted = useSelector<AssessmentModificationProps>(state => state.modified);

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        ApiService.FetchNavigation(loadCriteriaResults, criteriaDefinitionsErrorCallback);
    }, [modified]);

    const loadCriteriaResults = (response: NavigationCriteria[]) => {
        setItemRefDescriptions(sortByString<NavigationCriteria>(response, (item) => item.title))
    };

    const criteriaDefinitionsErrorCallback = (error: string) => {
        console.log(error);
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
        <ListItemButton onClick={() => {
            navigate(`/all`)
        }}>
            <ListItemText primary="View All" />
        </ListItemButton>
        <List>
        </List></>);
}

export default SideNavigation;