import { Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { ApiService } from "./ApiService";
import { format } from "date-fns";
import remarkGfm from "remark-gfm";
import CriteriaAssessment from "./model/CriteriaAssessment";
import Criteria from "./model/Criteria";
import { AxiosError } from "axios";

interface AssessmentModalProps {
  assessmentId: string | null;
  criteriaId: string | null;
  show: boolean;
  handleClose: () => void;
  handleShow: (assessmentId: string) => void;
  itemRefDescriptions: Criteria[];
}

const AssessmentModal: React.FC<AssessmentModalProps> = (props) => {
  const [assessmentFocussed, setAssessmentFocussed] = useState<CriteriaAssessment | null>(null);
  const [enableEdit, setEnableEdit] = useState(false);
  const [assessmentValue, setAssessmentValue] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString());

  const criteriaMap = new Map<string, Criteria>();
  if (props.itemRefDescriptions) {
    props.itemRefDescriptions.forEach((element) => {
      criteriaMap.set(element._id, element);
    });
  }

  useEffect(() => {
    if (props.assessmentId) {
      const fetchedPromise = ApiService.FetchAssessment(props.assessmentId, setAssessmentFocussed)!;
      fetchedPromise.then((result) => {
        setAssessmentValue(result?.value);
        setAssessmentDate(result?.assessmentDate);
      });
    }
  }, [props.assessmentId, props.show]);

  // this is only firing when the criteria id changes...
  useEffect(() => {
    if (!props.assessmentId && props.criteriaId) {
      setAssessmentValue("");
      setEnableEdit(true);
    } else {
      setEnableEdit(false);
    }
  }, [props.criteriaId, props.show]);

  const handleSave = async () => {
    if (props.assessmentId) {
      await ApiService.UpdateAssessment(
        {
          _id: props.assessmentId,
          assessmentDate: assessmentDate,
          value: assessmentValue,
        },
        () => {
          ApiService.FetchAssessment(props.assessmentId!, setAssessmentFocussed)!.then((result) => {
            setAssessmentValue(result.value);
          });
        }
      );
    } else {
      ApiService.CreateNewAssessment(
        {
          criteriaId: props.criteriaId!,
          assessmentDate: assessmentDate,
          value: assessmentValue,
        },
        () => {
          setEnableEdit(false);
          setAssessmentFocussed(null);
          setAssessmentValue("");
          props.handleClose();
        },
        (error: AxiosError) => {
          // console.log(error!.response!.data!.message);
          console.log(error!.response!.status);
          console.log(error!.response!.headers);
        }
      );
    }
  };

  const handleDelete = (assessmentId: string) => {
    ApiService.DeleteAssessment(assessmentId, () => {
      setEnableEdit(false);
      setAssessmentFocussed(null);
      setAssessmentValue("");
      props.handleClose();
    });
  };

  const getCriteriaTitle = () => {
    let title = "Assessment";
    if (assessmentFocussed?.criteria?.title) {
      title = assessmentFocussed.criteria.title;
    } else if (!props.assessmentId && props.criteriaId) {
      title = criteriaMap.get(props.criteriaId)!.title;
    }
    return title;
  };

  const getCriteriaDescription = () => {
    let description = "";
    if (assessmentFocussed?.criteria?.formattedDescription) {
      description = assessmentFocussed.criteria.formattedDescription;
    } else if (!props.assessmentId && props.criteriaId) {
      description = criteriaMap.get(props.criteriaId)!.formattedDescription;
    }
    return description;
  };

  const getEditButtonLabel = () => {
    if (!props.assessmentId && props.criteriaId) {
      return "Add";
    } else if (enableEdit) {
      return "Save Changes";
    }
    return "Edit";
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} onExited={props.handleClose} className="modal-xl">
      <ModalHeader closeButton>
        <ModalTitle>{getCriteriaTitle()}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Container>
          <Row className="mb-3">
            <Col>
              <Markdown
                components={{
                  table: (props) => {
                    const {children} = props;
                    return <table className="table">{children}</table>;
                  },
                }}
              >
                {getCriteriaDescription()}
              </Markdown>
              <p style={{ fontSize: "small" }}>
                The value field supports formatted text. See <a href="https://www.markdownguide.org/basic-syntax/">Markdown Syntax</a> for details
              </p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label className="form-label mb-0 p-0">Date</label>
              <input
                type="date"
                className={enableEdit ? "form-control" : "form-control"}
                value={assessmentDate ? CriteriaAssessment.FormatDate(assessmentDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                readOnly={!enableEdit}
                onChange={(e) => {
                  setAssessmentDate(e.target.value);
                }}
              ></input>
            </Col>
          </Row>
          <Row>
            <Col>
              {enableEdit ? (
                <textarea
                  className="form-control w-100"
                  value={assessmentValue}
                  rows={10}
                  onChange={(e) => {
                    setAssessmentValue(e.target.value);
                  }}
                  placeholder="Enter your self assessment here. What did you do? Who was involved? How did it result? What can you do better next time?"
                ></textarea>
              ) : (
                <div className="form-control">
                  <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>{assessmentFocussed?.value}</Markdown>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          onClick={() => {
            if (enableEdit) {
              handleSave();
            }
            setEnableEdit(!enableEdit);
          }}
        >
          {getEditButtonLabel()}
        </Button>
        {props.assessmentId ? (
          <Button
            className="bg-danger"
            disabled={!enableEdit}
            onClick={() => {
              handleDelete(props.assessmentId!);
            }}
          >
            Delete
          </Button>
        ) : (
          <></>
        )}
        <Button
          onClick={() => {
            setEnableEdit(false);
            setAssessmentFocussed(null);
            setAssessmentValue("");
            props.handleClose();
          }}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssessmentModal;
