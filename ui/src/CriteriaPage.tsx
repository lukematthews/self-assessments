import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import { ApiService } from "./ApiService";
import Criteria from "./model/Criteria";
import CriteriaAssessment from "./model/CriteriaAssessment";
import { parseIsoDate } from "./model/ui/utils";
import AssessmentEditor from "./AssessmentEditor";
import AssessmentDisplay from "./AssessmentDisplay";
import { useSelector } from "react-redux";
import { AssessmentModificationProps } from "./redux/AssessmentReducer";
import { Button } from "@mui/material";

const CriteriaPage: React.FC<{}> = () => {
  const [item, setCriteria] = useState<Criteria | null>();
  const [assessments, setAssessments] = useState<CriteriaAssessment[]>([]);
  const params = useParams();
  const [open, setOpen] = useState(false);
  const modified = useSelector<AssessmentModificationProps>((state) => state.modified);

  useEffect(() => {
    ApiService.FetchCriteria(params.criteriaName!, loadAssessments);
  }, [params.criteriaName, modified]);

  const loadAssessments = (response: Criteria) => {
    setCriteria(response);
    ApiService.FetchAssessmentsForCriteria(response._id, storeAssessments);
  };

  const storeAssessments = (assessments: CriteriaAssessment[]) => {
    setAssessments(assessments.sort((a, b) => parseIsoDate(b.assessmentDate).getTime() - parseIsoDate(a.assessmentDate).getTime()));
  };

  if (!item) {
    return <></>;
  }

  return (
    <>
      <Row>
        <Col lg="12">
          <div id={`criteria-button-row-${item._id}`} className="criteria-definition">
            <h2>{item!.title}</h2>
            <div className="criteria-definition-description pt-2">
              <Markdown>{item!.description}</Markdown>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col lg="12">
          {open ? (
            <AssessmentEditor
              criteria={item}
              value=""
              open={open}
              showAdd={true}
              saveCallback={() => {
                ApiService.FetchCriteria(params.criteriaName!, loadAssessments);
                setOpen(false);
              }}
              cancelCallback={() => {
                setOpen(!open);
              }}
            ></AssessmentEditor>
          ) : (
            <Button onClick={() => setOpen(!open)}>Add</Button>
          )}
        </Col>
      </Row>
      {assessments.map((assessment) => {
        return <AssessmentDisplay assessment={assessment} key={assessment._id}></AssessmentDisplay>;
      })}
      <Row></Row>
    </>
  );
};

export default CriteriaPage;
