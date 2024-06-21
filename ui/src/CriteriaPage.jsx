import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import { FetchAssessmentsForCriteria, FetchCriteria } from "./ApiService";
import { FormatDate } from "./Home";
import remarkGfm from "remark-gfm";

const CriteriaPage = (props) => {
    const [item, setCriteria] = useState({});
    const [assessments, setAssessments] = useState([]);
    let params = useParams();
    console.log(`Criteria name: ${params.criteriaName}`);

    useEffect(() => {
        FetchCriteria(params.criteriaName, loadAssessments);
    }, [params.criteriaName]);

    const loadAssessments = (response) => {
        setCriteria(response);
        FetchAssessmentsForCriteria(response._id, setAssessments);
    }

    return (<>
        <Row>
            <Col lg="12">
                <div
                    id={`criteria-button-row-${item._id}`}
                    className="criteria-definition"
                >
                    <div className="criteria-definition-description pt-2">
                        <Markdown>{item.formattedDescription}</Markdown>
                    </div>
                </div>
            </Col>
        </Row>
        {
            assessments.map(assessment => {
                return (<React.Fragment key={assessment._id}>
                    <Row className="bg-secondary">
                        <Col lg="12" className="fw-bold fst-italic p-1">
                            Date: {FormatDate(assessment.assessmentDate)}
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <Markdown
                                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                            >
                                {assessment?.value}
                            </Markdown>
                        </Col>
                    </Row>
                </React.Fragment>);
            })
        }
        <Row>
        </Row>
    </>
    );
}

export default CriteriaPage;