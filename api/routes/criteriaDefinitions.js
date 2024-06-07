const express = require("express");
const router = express.Router();
const criteriaDefinitionController = require("../controllers/criteriaDefinitionController");

router
  .route("/")
  .get(criteriaDefinitionController.getAllItems)
  .post(criteriaDefinitionController.createNewItems)
  .put(criteriaDefinitionController.updateItem)
  .delete(criteriaDefinitionController.deleteItem);

router.route("/:id").get(criteriaDefinitionController.getItem);
router.route("/clear").delete(criteriaDefinitionController.deleteAll);

module.exports = router;
