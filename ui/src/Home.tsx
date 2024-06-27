import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { format, parse, parseISO } from "date-fns";
import { ApiService } from "./ApiService";
import "./Home.css";
import AssessmentModal from "./AssessmentModal";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from "@mui/x-data-grid";
import Criteria from "./model/Criteria";
import CriteriaDisplay from "./CriteriaDisplay";
import { AssessmentGroup, AssessmentWithTitle } from "./model/ui/AssessmentGroup";
import { CriteriaUI } from "./model/ui/DisplayTypes";

export function FormatDate(dateString: string, pattern: string) {
  return format(parseISO(dateString), pattern ? pattern : "PPPP");
}

export default function Home() {
  const [assessments, setAssessments] = useState<AssessmentGroup[]>([]);
  const [itemRefDescriptions, setItemRefDescriptions] = useState<Criteria[]>([]);
  const [show, setShow] = useState(false);
  const [assessmentId, setAssessmentId] = useState<null | string>(null);
  const [criteriaId, setCriteriaId] = useState<null | string>("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [criteriaVisibility, setCriteriaVisibility] = useState<Map<string, boolean>>(new Map());

  function handleClose() {
    ApiService.fetchAllAssessments().then((response) => loadAssessments(response.data));
    setShow(false);
  }

  function handleShow(assessmentId: string) {
    setAssessmentId(assessmentId);
    setCriteriaId(null);
    setShow(true);
  }

  function loadCriteriaResults(response: Criteria[]) {
    const visibility = new Map<string, boolean>();
    const criteriaUi: CriteriaUI[] = response.map((c) => {
      visibility.set(c._id, true);
      return { actionsVisible: false, ...c };
    });

    setItemRefDescriptions(criteriaUi);
    setCriteriaVisibility(visibility);
  }

  useEffect(() => {
    ApiService.fetchAllAssessments().then((response) => loadAssessments(response.data));
    ApiService.fetchCriteriaDescriptions(loadCriteriaResults, criteriaDefinitionsErrorCallback);
  }, []);

  function loadAssessments(data: AssessmentGroup[]) {
    data.forEach((item) => {
      item.assessmentDate = parse(item.assessmentDate, "yyyy-MM-dd", new Date()).toString();
    });

    setAssessments(data);
    setLoadFailed(false);
  }

  function criteriaDefinitionsErrorCallback() {
    setLoadFailed(true);
  }

  function toggleHover(criteria: CriteriaUI, visible: boolean) {
    criteria.actionsVisible = visible;
    setItemRefDescriptions([...itemRefDescriptions]);
  }

  const columns: GridColDef[] = [
    {
      field: "assessmentDate",
      headerName: "Date",
      type: "date",
      width: 150,
      valueFormatter: (assessmentDate: Date) => {
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
      renderCell: (params: GridRenderCellParams) => {
        return (
          <div>
            {params.row.assessments
              .filter((item: AssessmentWithTitle) => criteriaVisibility.get(item.criteriaId))
              .map((item: AssessmentWithTitle) => {
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

  const rows: GridRowsProp = [...assessments];

  return (
    <Container>
      <Row>
        <Col>
          <p>Checkin against the criteria for the job on a regular basis to track progress and evidence of how the job is going.</p>
          <p style={{ fontSize: "small" }}>
            <span className="fw-bold">Instructions:</span> Click on a criteria to add a new assessment for it. The table is grouped by date. Click on an item to view it or edit it.
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <DataGrid rows={rows} columns={columns} getRowHeight={() => "auto"} />
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <h3>Criteria</h3>
        </Col>
      </Row>
      <Row>
        {itemRefDescriptions.map((item) => {
          return (
            <CriteriaDisplay
              key={`item.${item._id}`}
              item={item}
              toggleHover={toggleHover}
              visibleClicked={(item_id: string, visible: boolean) => {
                const updatedVisibility = new Map(criteriaVisibility);
                updatedVisibility.set(item_id, visible);
                setCriteriaVisibility(updatedVisibility);
              }}
              addClicked={(item_id: string) => {
                setAssessmentId(null);
                setCriteriaId(item_id);
                setShow(true);
              }}
            ></CriteriaDisplay>
          );
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
