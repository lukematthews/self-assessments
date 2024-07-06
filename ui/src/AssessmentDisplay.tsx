import { AccordionSummary, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import CriteriaAssessment from "./model/CriteriaAssessment";
import { purple } from "@mui/material/colors";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "./ConfirmationDialog";
import { ApiService } from "./ApiService";
import { useDispatch } from "react-redux";
import { ModificationAction, setModifiedAssessment } from "./redux/AssessmentReducer";
import AssessmentEditor from "./AssessmentEditor";

interface AssessmentDisplayProps {
  assessment: CriteriaAssessment;
}

const AssessmentDisplay: React.FC<AssessmentDisplayProps> = (props) => {
  const { assessment } = props;
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();

  const editAssessment = () => {
    setEditing(true);
  };

  return (
    <>
      <ConfirmationDialog
        message="Are you sure?"
        title="Delete Assessment"
        open={deleteConfirmOpen}
        onConfirm={() => {
          ApiService.DeleteAssessment(assessment._id!, () => {
            setDeleteConfirmOpen(false);
            dispatch(setModifiedAssessment({ type: "assessment/setModifiedAssessment", payload: { assessment: assessment, action: ModificationAction.DELETED } }));
          });
        }}
      ></ConfirmationDialog>
      <Row style={{ backgroundColor: purple[100] }}>
        <AccordionSummary style={{ backgroundColor: purple[100] }}>
          Date: {CriteriaAssessment.FormatDate(assessment.assessmentDate)}
          <IconButton
            size="small"
            onClick={() => {
              editAssessment();
            }}
          >
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setDeleteConfirmOpen(true);
            }}
          >
            <DeleteIcon></DeleteIcon>
          </IconButton>
        </AccordionSummary>
      </Row>
      <Row>
        <Col lg="12">
          {editing ? (
            <>
              <AssessmentEditor
                criteria={assessment.criteria}
                assessment={assessment}
                open={editing}
                saveCallback={() => {
                  setEditing(false);
                }}
                cancelCallback={() => {
                  setEditing(false);
                }}
                showAdd={false}
                value={assessment.value}
              ></AssessmentEditor>
            </>
          ) : (
            <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>{assessment?.value}</Markdown>
          )}
        </Col>
      </Row>
    </>
  );
};
export default AssessmentDisplay;
