import express from "express";
import * as controller from "../controllers/criteriaDefinitionController";

const criteriaDefinitionsRouter = express.Router();

export default criteriaDefinitionsRouter;

criteriaDefinitionsRouter.route("/").get(controller.getAllCriteria).post(controller.createNewItems);

criteriaDefinitionsRouter.route("/:id").get(controller.getCriteria).put(controller.updateCriteria).delete(controller.deleteCriteria);
criteriaDefinitionsRouter.route("/clear").delete(controller.deleteAll);
