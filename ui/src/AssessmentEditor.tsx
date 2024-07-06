import { Button } from "@mui/material";
import { Col, Collapse, Container, Row } from "react-bootstrap";
import Markdown from "react-markdown";
import { useState } from "react";
import Criteria from "./model/Criteria";
import { ApiService } from "./ApiService";
import { format, formatDate } from "date-fns";
import { CriteriaAssessmentCreateRequest } from "./model/ui/DisplayTypes";
import ConfirmationDialog from "./ConfirmationDialog";
import { useDispatch } from "react-redux";
import { setModifiedAssessment } from "./redux/AssessmentReducer";
import { CriteriaAssessmentUpdateRequest } from "./model/ui/CriteriaAssessmentUpdateRequest";
import CriteriaAssessment from "./model/CriteriaAssessment";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";

interface AssessmentEditorProps {
  criteria: Criteria;
  assessment?: CriteriaAssessment;
  open: boolean;
  showAdd: boolean;
  value: string;
  saveCallback: () => void;
  cancelCallback: () => void;
}

enum MODE {
  ADD,
  EDIT,
}

const AssessmentEditor: React.FC<AssessmentEditorProps> = (props) => {
  const { assessment, criteria, open, showAdd, saveCallback, cancelCallback, value } = props;

  const [editOpen, setOpen] = useState(open);
  const [assessmentState, setAssessment] = useState<CriteriaAssessment | null>(assessment ? assessment : null);
  const [assessmentDate, setAssessmentDate] = useState<Dayjs>(assessment ? dayjs(assessment.assessmentDate) : dayjs());
  const [assessmentValue, setAssessmentValue] = useState<string>(value);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const mode = assessment ? MODE.EDIT : MODE.ADD;

  const dispatch = useDispatch();

  const updateAssessment = () => {
    if (assessmentState) {
      const assessmentRequest: CriteriaAssessmentUpdateRequest = {
        _id: assessmentState._id!,
        assessmentDate: format(assessmentDate.toDate(), "yyyy-MM-dd"),
        value: assessmentValue,
      };
      ApiService.UpdateAssessment(assessmentRequest, (savedAssessment: CriteriaAssessment) => {
        dispatch(setModifiedAssessment({ type: "assessment/setModifiedAssessment", payload: { assessment: savedAssessment, action: "MODIFIED" } }));
        setConfirmationOpen(true);
      });
      setOpen(false);
      saveCallback();
    }
  };

  const createAssessment = () => {
    const assessmentRequest: CriteriaAssessmentCreateRequest = {
      criteriaId: criteria._id,
      assessmentDate: formatDate(assessmentDate.toDate(), "yyyy-MM-dd"),
      value: assessmentValue,
    };
    ApiService.CreateNewAssessment(assessmentRequest, (savedAssessment: CriteriaAssessment) => {
      dispatch(setModifiedAssessment({ type: "assessment/setModifiedAssessment", payload: { assessment: savedAssessment, action: "ADDED" } }));
      setConfirmationOpen(true);
      setOpen(false);
      saveCallback();
    });
  };

  interface Actions {
    save: () => void;
    confirmation: { title: string; message: string };
  }

  const ADD_DEFAULTS: Actions = {
    save: createAssessment,
    confirmation: {
      title: "Create Assessment",
      message: "Assessment Successfully Added",
    },
  };

  const EDIT_DEFAULTS: Actions = {
    save: updateAssessment,
    confirmation: {
      title: "Save Assessment",
      message: "Assessment Successfully Saved",
    },
  };

  function setActions(mode: MODE): Actions {
    if (mode === MODE.ADD) {
      return ADD_DEFAULTS;
    } else if (mode === MODE.EDIT) {
      return EDIT_DEFAULTS;
    } else {
      throw Error(`Invalid mode: ${mode}`);
    }
  }

  const actions: Actions = setActions(mode);

  return (
    <>
      <div className="my-2">
        <ConfirmationDialog
          title={actions.confirmation.title}
          message={actions.confirmation.message}
          open={confirmationOpen}
          onConfirm={() => {
            setOpen(false);
          }}
        ></ConfirmationDialog>
      </div>
      <Collapse in={editOpen}>
        <Container>
          <Row className="mb-0">
            <Col>
              <Markdown
                components={{
                  table: (props) => {
                    const { children } = props;
                    return <table className="table">{children}</table>;
                  },
                }}
              >
                {criteria?.formattedDescription}
              </Markdown>
              <p style={{ fontSize: "small" }}>
                The value field supports formatted text. See <a href="https://www.markdownguide.org/basic-syntax/">Markdown Syntax</a> for details
              </p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label className="form-label mb-0 p-0">Date</label>
              <DatePicker label="Controlled picker" value={assessmentDate!} onChange={(newValue) => setAssessmentDate(newValue!)} />{" "}
            </Col>
          </Row>
          <Row>
            <Col>
              <textarea
                className="form-control w-100"
                value={assessmentValue}
                rows={10}
                onChange={(e) => {
                  setAssessmentValue(e.target.value);
                }}
                placeholder="Enter your self assessment here. What did you do? Who was involved? How did it result? What can you do better next time?"
              ></textarea>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="p-2">
                  <Button type="submit" variant="contained" onClick={() => actions.save()}>
                    Save
                  </Button>
                </div>
                <div className="py-2">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpen(false);
                      cancelCallback();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Collapse>
    </>
  );
};

export default AssessmentEditor;
