import {
  Button,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
} from "react-bootstrap";
import {
  FetchAssessment,
  CreateNewAssessment,
  DeleteAssessment,
} from "./ApiService";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { FormatDate } from "./Home";
import { UpdateAssessment } from "./ApiService";
import { format } from "date-fns";
import remarkGfm from "remark-gfm";

const AssessmentModal = ({
  assessmentId,
  criteriaId,
  itemRefDescriptions,
  show,
  handleClose,
}) => {
  const [assessmentFocussed, setAssessmentFocussed] = useState({});
  const [enableEdit, setEnableEdit] = useState(false);
  const [assessmentValue, setAssessmentValue] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(
    new Date().toISOString()
  );

  const criteriaMap = {};
  itemRefDescriptions.forEach((element) => {
    criteriaMap[element._id] = element;
  });

  useEffect(() => {
    if (assessmentId) {
      let fetchedPromise = FetchAssessment(assessmentId, setAssessmentFocussed);
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
      await UpdateAssessment(
        {
          _id: assessmentId,
          assessmentDate: assessmentDate,
          value: assessmentValue,
        },
        () => {
          FetchAssessment(assessmentId, setAssessmentFocussed).then(
            (result) => {
              setAssessmentValue(result.value);
            }
          );
        }
      );
    } else {
      CreateNewAssessment(
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
        (error) => {
          console.log(error.response.data.message);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      );
    }
  };

  const handleDelete = (assessmentId) => {
    DeleteAssessment(assessmentId, () => {
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
      title = criteriaMap[criteriaId].title;
    }
    return title;
  };

  const getCriteriaDescription = () => {
    let description = "";
    if (assessmentFocussed?.criteria?.formattedDescription) {
      description = assessmentFocussed.criteria.formattedDescription;
    } else if (!assessmentId && criteriaId) {
      description = criteriaMap[criteriaId].formattedDescription;
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
    <Modal show={show} onHide={handleClose} className="modal-xl">
      <ModalHeader closeButton>
        <ModalTitle>{getCriteriaTitle()}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Container>
          <Row className="mb-3">
            <Col>
              <Markdown
                components={{
                  Table: (props) => <table className="table">{props}</table>,
                }}
              >
                {getCriteriaDescription()}
              </Markdown>
              <p style={{ fontSize: "small" }}>
                The value field supports formatted text. See{" "}
                <a href="https://www.markdownguide.org/basic-syntax/">
                  Markdown Syntax
                </a>{" "}
                for details
              </p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <label className="form-label mb-0 p-0">Date</label>
              <input
                type="date"
                className={enableEdit ? "form-control" : "form-control"}
                value={
                  assessmentDate
                    ? FormatDate(assessmentDate, "yyyy-MM-dd")
                    : format(new Date(), "yyyy-MM-dd")
                }
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
                  onChange={(e) => {
                    setAssessmentValue(e.target.value);
                  }}
                  placeholder="Enter your self assessment here. What did you do? Who was involved? How did it result? What can you do better next time?"
                ></textarea>
              ) : (
                <div className="form-control">
                  <Markdown
                    remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                  >
                    {assessmentFocussed?.value}
                  </Markdown>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button
          type="submit"
          onClick={(e) => {
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
};

export default AssessmentModal;
