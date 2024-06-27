import { Button, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { FormatDate } from "./Home";
import { ApiService } from "./ApiService";
import { format } from "date-fns";
import remarkGfm from "remark-gfm";
import CriteriaAssessment from "./model/CriteriaAssessment";
import Criteria from "./model/Criteria";
import { AxiosError } from "axios";

export default function AssessmentModal({assessmentId, criteriaId, show, handleClose, handleShow, itemRefDescriptions} : {assessmentId: string | null, criteriaId: string | null, itemRefDescriptions: Criteria[], show: boolean, handleShow: (assessmentId: string) => void, handleClose: () => void}) {
  const [assessmentFocussed, setAssessmentFocussed] = useState<CriteriaAssessment | null>(null);
  const [enableEdit, setEnableEdit] = useState(false);
  const [assessmentValue, setAssessmentValue] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString());

  const criteriaMap = new Map<string, Criteria>();
  if (itemRefDescriptions) {
    itemRefDescriptions.forEach((element) => {
      criteriaMap.set(element._id, element);
    });
  }

  useEffect(() => {
    if (assessmentId) {
      const fetchedPromise = ApiService.FetchAssessment(assessmentId, setAssessmentFocussed)!;
      fetchedPromise.then((result) => {
        setAssessmentValue(result?.value);
        setAssessmentDate(result?.assessmentDate);
      });
    }
  }, [assessmentId, show]);

  // this is only firing when the criteria id changes...
  useEffect(() => {
    if (!assessmentId && criteriaId) {
      setAssessmentValue("");
      setEnableEdit(true);
    } else {
      setEnableEdit(false);
    }
  }, [criteriaId, show]);

  const handleSave = async () => {
    if (assessmentId) {
      await ApiService.UpdateAssessment(
        {
          _id: assessmentId,
          assessmentDate: assessmentDate,
          value: assessmentValue,
        },
        () => {
          ApiService.FetchAssessment(assessmentId, setAssessmentFocussed)!.then((result) => {
            setAssessmentValue(result.value);
          });
        }
      );
    } else {
      ApiService.CreateNewAssessment(
        {
          id: criteriaId,
          assessmentDate: assessmentDate,
          value: assessmentValue,
        },
        () => {
          setEnableEdit(false);
          setAssessmentFocussed(null);
          setAssessmentValue("");
          handleClose();
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
      handleClose();
    });
  };

  const getCriteriaTitle = () => {
    let title = "Assessment";
    if (assessmentFocussed?.criteria?.title) {
      title = assessmentFocussed.criteria.title;
    } else if (!assessmentId && criteriaId) {
      title = criteriaMap.get(criteriaId)!.title;
    }
    return title;
  };

  const getCriteriaDescription = () => {
    let description = "";
    if (assessmentFocussed?.criteria?.formattedDescription) {
      description = assessmentFocussed.criteria.formattedDescription;
    } else if (!assessmentId && criteriaId) {
      description = criteriaMap.get(criteriaId)!.formattedDescription;
    }
    return description;
  };

  const getEditButtonLabel = () => {
    if (!assessmentId && criteriaId) {
      return "Add";
    } else if (enableEdit) {
      return "Save Changes";
    }
    return "Edit";
  };

  return (
    <Modal show={show} onHide={handleClose} onExited={handleClose} className="modal-xl">
      <ModalHeader closeButton>
        <ModalTitle>{getCriteriaTitle()}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Container>
          <Row className="mb-3">
            <Col>
              <Markdown
                components={{
                  table: (props) => <table className="table">{props}</table>,
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
                value={assessmentDate ? FormatDate(assessmentDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
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
        {assessmentId ? (
          <Button
            className="bg-danger"
            disabled={!enableEdit}
            onClick={() => {
              handleDelete(assessmentId);
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
            handleClose();
          }}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
