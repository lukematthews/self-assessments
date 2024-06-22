import { useState, useEffect } from "react";
import { FetchAllAssessmentsWithValues, FetchCriteriaDescriptions } from "./ApiService";
import { Col, Row } from "react-bootstrap";
import CriteriaPopover from "./CriteriaPopover";
import "./Home.css";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, Button } from "@mui/material";
import { FormatDate } from "./Home";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { purple } from "@mui/material/colors";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const AllPage = () => {
    const [criteria, setCriteria] = useState([]);
    const [criteriaVisibility, setCriteriaVisibility] = useState({});
    const [loadFailed, setLoadFailed] = useState(false);
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        FetchCriteriaDescriptions(loadCriteriaResults, criteriaDefinitionsErrorCallback);
        FetchAllAssessmentsWithValues(groupAndFilterAssessments)
    }, []);

    const loadCriteriaResults = (response) => {
        setCriteria(response);
        let visibility = {};
        response.forEach(c => {
            visibility[c._id.toString()] = true;
        });
        setCriteriaVisibility(visibility);
    };

    const criteriaDefinitionsErrorCallback = (error) => {
        setLoadFailed(true);
    }


    const groupAndFilterAssessments = (assessments) => {
        setAssessments(assessments);
    };

    const criteriaClicked = (id, visible) => {
        let c = { ...criteriaVisibility };
        c[id] = visible;
        setCriteriaVisibility(c);
    }

    const hideAll = () => {
        let c = { ...criteriaVisibility };
        Object.keys(c).forEach(id => c[id] = false);
        setCriteriaVisibility(c);
    }

    class AssessmentListActions {
        constructor(assessments) {
            this.assessments = assessments;
        }

        filterAssessments() {
            this.assessments = this.assessments.filter(a => criteriaVisibility[a.criteriaId]);
            return this;
        }

        sortByCriteriaName() {
            this.assessments = this.assessments.sort((a, b) => { return a.title > b.title ? 1 : (b.title > a.title) ? -1 : 0 });
            return this;
        }

        get() {
            return this.assessments;
        }
    }

    const renderAssessments = (aa) => {
        let toRender = new AssessmentListActions(aa).filterAssessments().sortByCriteriaName().get();
        return toRender.map(a => {
            return (
                <Accordion key={a.id + " " + a.criteriaId}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: purple[50] }}>
                        <Typography>{a.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                                {a?.value}
                            </Markdown>

                        </div>
                    </AccordionDetails>
                </Accordion>);
        });
    }

    return (<>
        <Row>
            <Col lg="12" className="all-page-criteria">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {
                            criteria.map(c => {
                                return (
                                    <Grid key={c._id} item>
                                        <CriteriaPopover criteria={c} visibleClicked={criteriaClicked}></CriteriaPopover>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Box>
            </Col>
        </Row>
        <Row className="py-2">
            <Col lg="12">
                <Button variant="contained" onClick={hideAll}>
                    Hide All
                </Button>
            </Col>
        </Row>
        <Row>
            <Col lg="12">
                {
                    assessments.map(assessment => {
                        return (<Accordion key={assessment.assessmentDate}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: purple[100] }}>
                                Date: {FormatDate(assessment.assessmentDate)}
                            </AccordionSummary>
                            <AccordionDetails>
                                {
                                    renderAssessments(assessment.assessments)
                                }

                            </AccordionDetails>
                        </Accordion>);
                    })
                }
            </Col>
        </Row>
    </>);
};

export default AllPage;