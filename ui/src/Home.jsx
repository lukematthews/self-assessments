import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { format, parse, parseISO } from "date-fns";
import { FetchAllAssessments, FetchItemRefDescriptions } from "./ApiService";
import "./Home.css";
import AssessmentModal from "./AssessmentModal";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Criteria from "./Criteria";


export function FormatDate(dateString, pattern) {
  return format(parseISO(dateString), pattern ? pattern : "PPPP");
}

function Home() {
  const [assessments, setAssessments] = useState([]);
  const [itemRefDescriptions, setItemRefDescriptions] = useState([]);
  const [show, setShow] = useState(false);
  const [assessmentId, setAssessmentId] = useState("");
  const [criteriaId, setCriteriaId] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [criteriaVisibility, setCriteriaVisibility] = useState({});

  const handleClose = () => {
    FetchAllAssessments(loadAssessments);
    setShow(false);
  };
  const handleShow = (assessmentId) => {
    setAssessmentId(assessmentId);
    setCriteriaId(null);
    setShow(true);
  };

  const loadCriteriaResults = (response) => {
    let visibility = {};
    response.forEach((item) => {
      item.actionsVisible = false;
      visibility[item._id] = true;
    });
    setItemRefDescriptions(response);
    setCriteriaVisibility(visibility);
  };

  useEffect(() => {
    FetchAllAssessments(loadAssessments);
    FetchItemRefDescriptions(loadCriteriaResults, criteriaDefinitionsErrorCallback);
  }, []);

  const loadAssessments = (data) => {
    data.forEach(item => {
      item.date = parse(item.assessmentDate, "yyyy-MM-dd", new Date());
    });
    setAssessments(data);
    setLoadFailed(false);
  }

  const criteriaDefinitionsErrorCallback = (error) => {
    setLoadFailed(true);
  }

  const toggleHover = (criteria, visible) => {
    criteria.actionsVisible = visible;
    setItemRefDescriptions([...itemRefDescriptions]);
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      type: 'date',
      width: 150,
      valueFormatter: (assessmentDate) => {
        if (!assessmentDate) {
          return assessmentDate;
        }
        return format(assessmentDate, "PPPP");
      },
    },
    {
      field: "assessments",
      headerName: "Criteria",
      display: "flex",
      flex: 1,
      renderCell: (data) => {
        return (
          <div>
            {data.row.assessments.filter(item => criteriaVisibility[item.criteriaId]).map((item) => {
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
          </div>
        );
      },
    },
  ];

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
          <DataGrid rows={assessments} columns={columns} getRowHeight={() => 'auto'} />
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <h3>Criteria</h3>
        </Col>
      </Row>
      <Row>
        {itemRefDescriptions.map((item) => {
          return (<Criteria key={`item.${item._id}`} item={item} toggleHover={toggleHover}
            visibleClicked={(item_id, visible) => {
              let updatedVisibility = {...criteriaVisibility};
              updatedVisibility[item_id] = visible;
              setCriteriaVisibility(updatedVisibility)
            }}
            addClicked={(item_id) => {
              setAssessmentId(null);
              setCriteriaId(item_id);
              setShow(true);
            }} ></Criteria>);
        })}
      </Row>
      <Row className={loadFailed ? "visible" : "invisible"}>
        <Col lg="12">
          <h1>Oh oh!</h1>
          <p>Couldn't reach the server</p>
        </Col>
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
