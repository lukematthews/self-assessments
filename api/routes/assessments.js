const express = require('express');
const router = express.Router();
// const criteriaController = require('../controllers/criteriaController');
const criteriaAssessmentController = require('../controllers/criteriaAssessmentsController');

router.route('/')
    .get(criteriaAssessmentController.getAllAssessments)
    .post(criteriaAssessmentController.createCriteriaAssessment)
    .put(criteriaAssessmentController.updateAssessment)
    .delete(criteriaAssessmentController.deleteAssessment);

router.route('/criteria-assessment')
    .post(criteriaAssessmentController.createCriteriaAssessmentBatch);

module.exports = router;