import { useState, useEffect } from "react";
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
import { sortByString } from "./model/ui/utils";
import { parse } from "date-fns";
import DeleteIcon from '@mui/icons-material/Delete';

const AllPage: React.FC<{}> = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [criteriaVisibility, setCriteriaVisibility] = useState<Map<string, boolean>>(new Map<string, boolean>());
  const [_loadFailed, setLoadFailed] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentGroup[]>([]);
  const [show, setShow] = useState(false);
  const [assessmentId, setAssessmentId] = useState<null | string>(null);
  const [criteriaId, setCriteriaId] = useState<null | string>("");

  useEffect(() => {
    ApiService.fetchCriteriaDescriptions(loadCriteriaResults, criteriaDefinitionsErrorCallback);
    ApiService.fetchAllAssessmentsWithValues(groupAndFilterAssessments);
  }, []);

  function loadCriteriaResults(response: Criteria[]) {
    const sortedCriteria = sortByString<Criteria>(response, (item: Criteria) => item.title);
    setCriteria(sortedCriteria);
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
    setAssessments(assessments.sort((a, b) => parseDate(b.assessmentDate).getTime() - parseDate(a.assessmentDate).getTime()));
  }

  function parseDate(dateString: string): Date {
    return parse(dateString, "yyyy-MM-dd", new Date());
  }

  function criteriaClicked(id: string, visible: boolean) {
    const c = new Map(criteriaVisibility);
    c.set(id, visible);
    setCriteriaVisibility(c);
  }

  function hideAll() {
    const c = new Map<string, boolean>(criteriaVisibility);
    Array.from(c.entries()).forEach((id) => c.set(id[0], false));
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

  function renderAssessments(aa: AssessmentWithTitle[]) {
    return new AssessmentList<AssessmentWithTitle>(aa)
      .filterAssessments((item: AssessmentWithTitle) => criteriaVisibility.get(item.criteriaId))
      .sortByCriteriaName((item: AssessmentWithTitle) => item.title)
      .getList()
      .map((a: AssessmentWithTitle, index: number) => {
        return (
          <Accordion key={`${index} ${a.criteriaId}`}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: purple[50] }}>
              <Typography>{a.title}</Typography>
              <DeleteIcon></DeleteIcon>
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
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="contained" onClick={hideAll}>
                  Hide All
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={hideAll}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
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
          <AssessmentModal show={show} handleClose={handleClose} handleShow={handleShow} assessmentId={assessmentId} criteriaId={criteriaId!} itemRefDescriptions={criteria}></AssessmentModal>
        </Col>
      </Row>
    </>
  );
};

export default AllPage;

class AssessmentList<T> {
  private list: T[];

  constructor(list: T[]) {
    this.list = list;
  }

  filterAssessments(getter: (item: T) => boolean | undefined) {
    this.list = this.list.filter((a) => getter(a));
    return this;
  }

  sortByCriteriaName(getter: (item: T) => string) {
    this.list = sortByString<T>(this.list, getter);
    return this;
  }

  getList() {
    return this.list;
  }
}
