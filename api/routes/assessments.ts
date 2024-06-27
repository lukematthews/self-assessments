import express from "express";
import * as criteriaAssessmentController from "../controllers/criteriaAssessmentsController";

const assessmentRouter = express.Router();

assessmentRouter
  .route("/")
  .get(criteriaAssessmentController.getAllAssessments)
  .post(criteriaAssessmentController.createCriteriaAssessment)
  .put(criteriaAssessmentController.updateAssessment)
  .delete(criteriaAssessmentController.deleteAssessment);

assessmentRouter.route("/criteria-assessment").post(criteriaAssessmentController.createCriteriaAssessmentBatch);

export default assessmentRouter;
