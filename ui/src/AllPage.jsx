import React, { useState, useEffect } from "react";
import { FetchAllAssessmentsWithValues, FetchCriteriaDescriptions } from "./ApiService";
import { Col, Container, Row } from "react-bootstrap";
import CriteriaPopover from "./CriteriaPopover";
import "./Home.css";
import { Box, Grid } from "@mui/material";
import { FormatDate } from "./Home";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { purple } from "@mui/material/colors";

export const AllPage = () => {
    const [criteria, setCriteria] = useState([]);
    const [loadFailed, setLoadFailed] = useState(false);
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
        FetchCriteriaDescriptions(loadCriteriaResults, criteriaDefinitionsErrorCallback);
        FetchAllAssessmentsWithValues(groupAndFilterAssessments)
    }, []);

    const loadCriteriaResults = (response) => {
        setCriteria(response);
    };

    const criteriaDefinitionsErrorCallback = (error) => {
        setLoadFailed(true);
    }


    const groupAndFilterAssessments = (assessments) => {
        setAssessments(assessments);
    };


    return (<>
        <Row>
            <Col lg="12" className="all-page-criteria">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {
                            criteria.map(c => {
                                return (
                                    <Grid item>
                                        <CriteriaPopover key={c._id} criteria={c} visibleClicked={(id, visible) => { }}></CriteriaPopover>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Box>
            </Col>
        </Row>
        {
            assessments.map(assessment => {
                return (<React.Fragment key={assessment._id}>
                    <Row className="mt-2" style={{backgroundColor: purple[50]}}>
                        <Col lg="12" className="fw-bold fst-italic px-2">
                            Date: {FormatDate(assessment.assessmentDate)}
                        </Col>
                    </Row>
                    {
                        assessment.assessments.map(a => {
                            return (<React.Fragment key={a._id}>
                                <Row style={{backgroundColor: purple[50]}}>
                                    <Col lg="12" className="h3">
                                        {a.title}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="12">
                                        <Markdown
                                            remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                                        >
                                            {a?.value}
                                        </Markdown>
                                    </Col>
                                </Row>
                            </React.Fragment>);
                        })
                    }
                </React.Fragment>);
            })
        }
    </>);
};

export default AllPage;