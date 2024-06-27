// routes/index.ts
import express from "express";
import {
  getAssessmentList,
  getAssessmentListWithContent,
  editAssessment,
  newAssessmentTemplate,
  getAssessment,
  getAllCriteria,
  getCriteriaForName,
  getAssessmentsForCriteria,
  getNavigationCriteria,
} from "../controllers/uiController";

const uiRouter = express.Router();

uiRouter.route("/list").get(getAssessmentList);
uiRouter.route("/list-with-values").get(getAssessmentListWithContent);
uiRouter.route("/edit/:id").get(editAssessment);
uiRouter.route("/assessment/:id").get(getAssessment);
uiRouter.route("/new").get(newAssessmentTemplate);
uiRouter.route("/criteria").get(getAllCriteria);
uiRouter.route("/criteria/:name").get(getCriteriaForName);
uiRouter.route("/assessments/criteria/:id").get(getAssessmentsForCriteria);
uiRouter.route("/navigation").get(getNavigationCriteria);

export default uiRouter;