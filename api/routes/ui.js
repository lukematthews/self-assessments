const express = require('express');
const router = express.Router();
const uiController = require('../controllers/uiController');

router.route('/list').get(uiController.getAssessmentList);
router.route('/list-with-values').get(uiController.getAssessmentListWithContent);
router.route('/edit/:id').get(uiController.editAssessment);
router.route('/assessment/:id').get(uiController.getAssessment);
router.route('/new').get(uiController.newAssessmentTemplate);
router.route('/criteria').get(uiController.getAllCriteria);
router.route('/criteria/:name').get(uiController.getCriteriaForName);
router.route('/assessments/criteria/:id').get(uiController.getAssessmentsForCriteria);
router.route('/list-grouped').get(uiController.getAssessmentsGroupedByDate);
router.route('/navigation').get(uiController.getNavigationCriteria);

module.exports = router;