import { useState, useEffect, ReactElement } from "react";
import { ApiService } from "./ApiService";
import { Col, Row } from "react-bootstrap";
import CriteriaPopover from "./CriteriaPopover";
import "./Home.css";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, Button } from "@mui/material";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { purple } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Criteria from "./model/Criteria";
import CriteriaAssessment from "./model/CriteriaAssessment";
import { AssessmentGroup, AssessmentWithTitle } from "./model/ui/AssessmentGroup";
import AssessmentModal from "./AssessmentModal";

export default function AllPage() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [criteriaVisibility, setCriteriaVisibility] = useState<Map<string, boolean>>(new Map());
  const [loadFailed, setLoadFailed] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentGroup[]>([]);
  const [show, setShow] = useState(false);
  const [assessmentId, setAssessmentId] = useState<null | string>(null);
  const [criteriaId, setCriteriaId] = useState<null | string>("");

  useEffect(() => {
    ApiService.fetchCriteriaDescriptions(loadCriteriaResults, criteriaDefinitionsErrorCallback);
    ApiService.fetchAllAssessmentsWithValues(groupAndFilterAssessments);
  }, []);

  function loadCriteriaResults(response: Criteria[]) {
    setCriteria(response);
    const visibility = new Map<string, boolean>();
    response.forEach((c) => {
      visibility.set(c._id.toString(), true);
    });
    setCriteriaVisibility(visibility);
  }

  function criteriaDefinitionsErrorCallback() {
    setLoadFailed(true);
  }

  function groupAndFilterAssessments(assessments: AssessmentGroup[]) {
    setAssessments(assessments);
  }

  function criteriaClicked(id: string, visible: boolean) {
    const c = { ...criteriaVisibility };
    c.set(id, visible);
    setCriteriaVisibility(c);
  }

  function hideAll() {
    const c = { ...criteriaVisibility };
    Object.keys(c).forEach((id) => c.set(id, false));
    setCriteriaVisibility(c);
  }

  function handleShow(assessmentId: string) {
    setAssessmentId(assessmentId);
    setCriteriaId(null);
    setShow(true);
  }

  function handleClose() {
    ApiService.fetchAllAssessments().then((response) => {
      setAssessments(response.data);
      setLoadFailed(false);
    });
    setShow(false);
  }

  function renderAssessments(aa: AssessmentWithTitle[]): JSX.Element {
    // return new AssessmentList(aa)
    return new AssessmentList2<AssessmentWithTitle>(aa)
      .filterAssessments((item: AssessmentWithTitle) => criteriaVisibility.get(item.criteriaId))
      .sortByCriteriaName()
      .map<ReactElement>((a: AssessmentWithTitle) => {
        return (
          <Accordion key={`${a.id} ${a.criteriaId}`}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: purple[50] }}>
              <Typography>{a.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>{a?.value}</Markdown>
              </div>
            </AccordionDetails>
          </Accordion>
        );
      });
  }

  return (
    <>
      <Row>
        <Col lg="12" className="all-page-criteria">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              {criteria.map((c) => {
                return (
                  <Grid key={c._id} item>
                    <CriteriaPopover
                      criteria={c}
                      visibleClicked={criteriaClicked}
                      addClicked={(criteriaId: string) => {
                        setAssessmentId(null);
                        setCriteriaId(criteriaId);
                        setShow(true);
                      }}
                    ></CriteriaPopover>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Col>
      </Row>
      <Row className="py-2">
        <Col lg="12">
          <Button variant="contained" onClick={hideAll}>
            Hide All
          </Button>
          <Button variant="contained" onClick={hideAll}>
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          {assessments.map((assessment) => {
            return (
              <Accordion key={assessment.assessmentDate}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: purple[100] }}>
                  Date: {CriteriaAssessment.FormatDate(assessment.assessmentDate)}
                </AccordionSummary>
                <AccordionDetails>{renderAssessments(assessment.assessments)}</AccordionDetails>
              </Accordion>
            );
          })}
        </Col>
      </Row>
      <Row>
        <Col>
          <AssessmentModal show={show} handleClose={handleClose} handleShow={handleShow} assessmentId={assessmentId} criteriaId={criteriaId} itemRefDescriptions={criteria}></AssessmentModal>
        </Col>
      </Row>
    </>
  );
}

class AssessmentList {
  private list: AssessmentWithTitle[];

  constructor(list: AssessmentWithTitle[]) {
    this.list = list;
  }

  filterAssessments(criteriaVisibility: Map<string, boolean>) {
    this.list = this.list.filter((a) => criteriaVisibility.get(a.criteriaId));
    return this;
  }

  sortByCriteriaName() {
    this.list = this.list.sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
    return this;
  }

  map<T>(cb: (value: AssessmentWithTitle) => ReactElement) {
    return this.list.map(cb) as T;
  }
}

type TitleAndCriteria = {title: string, criteriaId: string};

class AssessmentList2<T extends TitleAndCriteria> {
  private list: T[];

  constructor(list: T[]) {
    this.list = list;
  }

  filterAssessments(getter: (item: T) => boolean | undefined) {
    this.list = this.list.filter((a) => getter(a));
    return this;
  }

  sortByCriteriaName(getter: (item: T) => string) {
    this.list = this.list.sort((a, b) => (getter(a) > getter(b) ? 1 : getter(b) > getter(a) ? -1 : 0));
    return this;
  }

  map<T>(cb: (value: T, index: number, array: T[]) => ReactElement) {
    return this.list.map(cb) as T;
  }
}
