const express = require("express");
const router = express.Router();
const criteriaDefinitionController = require("../controllers/criteriaDefinitionController");

router
  .route("/")
  .get(criteriaDefinitionController.getAllCriteria)
  .post(criteriaDefinitionController.createNewItems);

router.route("/:id")
  .get(criteriaDefinitionController.getCriteria)
  .put(criteriaDefinitionController.updateCriteria)
  .delete(criteriaDefinitionController.deleteCriteria);
router.route("/clear").delete(criteriaDefinitionController.deleteAll);

module.exports = router;
