import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import {
  FetchAllAssessments,
  FetchItemRefDescriptions,
} from "./ApiService";
import "./Home.css";
import Markdown from "react-markdown";
import AssessmentModal from "./AssessmentModal";
import { Button } from "@mui/material";

export function FormatDate(dateString, pattern) {
  return format(parseISO(dateString), pattern ? pattern : "PPPP");
}

function Home() {
  const [assessments, setAssessments] = useState([]);
  const [itemRefDescriptions, setItemRefDescriptions] = useState([]);
  const [show, setShow] = useState(false);
  const [assessmentId, setAssessmentId] = useState("");
  const [criteriaId, setCriteriaId] = useState("");

  const handleClose = () => {
    FetchAllAssessments(setAssessments).then((result) =>
      setAssessments(result)
    );
    setShow(false);
  };
  const handleShow = (assessmentId) => {
    setAssessmentId(assessmentId);
    setCriteriaId(null);
    setShow(true);
  };

  useEffect(() => {
    FetchAllAssessments(setAssessments);
    FetchItemRefDescriptions(setItemRefDescriptions);
  }, []);

  const assessmentRow = (assessmentGroup) => {
    return (
      <tr key={assessmentGroup.assessmentDate}>
        <td>{FormatDate(assessmentGroup.assessmentDate)}</td>
        <td>
          {assessmentGroup.assessments.map((item) => {
            return (
              <Fragment key={item.id}>
                <Button
                  variant="text"
                  onClick={() => {
                    handleShow(item.id.toString());
                  }}
                  data-assessment-id={item.id}
                >
                  {item.title}
                </Button>
              </Fragment>
            );
          })}
        </td>
      </tr>
    );
  };

  return (
    <Container>
      <Row>
        <Col>
          <p>
            Checkin against the criteria for the job on a regular basis to track
            progress and evidence of how the job is going.
          </p>
          <p style={{ fontSize: "small" }}>
            <span className="fw-bold">Instructions:</span> Click on a criteria
            to add a new assessment for it. The table is grouped by date. Click
            on an item to view it or edit it.
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Criteria</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => {
                return assessmentRow(a);
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <h3>Criteria</h3>
        </Col>
      </Row>
      <Row>
        {itemRefDescriptions.map((item, index) => {
          return (
            <Col
              key={"item-" + index}
              lg="3"
              onClick={() => {
                setAssessmentId(null);
                setCriteriaId(item._id.toString());
                setShow(true);
              }}
            >
              <Markdown>{item.formattedDescription}</Markdown>
            </Col>
          );
        })}
      </Row>
      <Row>
        <Col>
          <AssessmentModal
            show={show}
            handleClose={handleClose}
            handleShow={handleShow}
            assessmentId={assessmentId}
            criteriaId={criteriaId}
            itemRefDescriptions={itemRefDescriptions}
          ></AssessmentModal>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
