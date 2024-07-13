import express from "express";
import { Criteria, CriteriaDefinitionModel } from "../model/Model";
import { CreateCriteriaRequest } from "../model/ControllerTypes";
import mongoose from "mongoose";

export async function getAllCriteria(req: express.Request, res: express.Response) {
  const items = await CriteriaDefinitionModel.find();
  if (!items) {
    return res.status(204).json({ message: "No items found" });
  }
  res.json(items);
}

export async function createNewItems(req: express.Request, res: express.Response) {
  if (!req?.body?.items) {
    console.log(req.body);
    return res.status(400).json({ message: "Criteria definitions are required" });
  }

  let results: Criteria[] = [];
  let criteriaRequests: CreateCriteriaRequest[] = req.body.items;
  criteriaRequests.forEach((criteriaRequest) => {
    CriteriaDefinitionModel.create({
      _id: new mongoose.Types.ObjectId(),
      title: criteriaRequest.title,
      description: criteriaRequest.description,
    }).then((data) => results.push(data));
  });

  console.log(results);
  res.status(201).json(results);
}

export async function updateCriteria(req: express.Request, res: express.Response) {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const criteria = await CriteriaDefinitionModel.findOne({ _id: req.body.id }).exec();

  if (!criteria) {
    return res.status(204).json({ message: `No criteria matches ID ${req.body.id}` });
  }

  if (req.body?.description) criteria.description = req.body.description;
  const result = await criteria.save();
  res.json(result);
}

export async function deleteCriteria(req: express.Request, res: express.Response) {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const criteria = await CriteriaDefinitionModel.findOne({ _id: req.body.id }).exec();

  if (!criteria) {
    return res.status(204).json({ message: `No criteria matches ID ${req.body.id}` });
  }
  const result = await criteria.deleteOne({ _id: req.body.id });
  res.json(result);
}

export async function deleteAll(req: express.Request, res: express.Response) {
  const result = CriteriaDefinitionModel.deleteMany().exec();
  res.json(result);
}

export async function getCriteria(req: express.Request, res: express.Response) {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const criteria = await CriteriaDefinitionModel.findOne({ _id: req.params.id }).exec();
  if (!criteria) {
    return res.status(204).json({ message: `No criteria matches ID ${req.body.id}` });
  }
  res.json(criteria);
}
