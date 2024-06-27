import express from "express";
import { CriteriaAssessment, CriteriaAssessmentModel, CriteriaDefinitionModel } from "../model/Model";

export async function getAllAssessments(req: express.Request, res: express.Response) {
  console.log("Get Assessments");
  const assessments = await CriteriaAssessmentModel.find()
    .sort({assessmentDate: "desc"})
    .exec();
  if (!assessments) {
    return res.status(204).json({ message: "No assessments found" });
  }
  res.json(assessments);
};

export async function updateAssessment(req: express.Request, res: express.Response) {
  console.log("Updating assessment");
  if (!req?.body?._id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const assessment = await CriteriaAssessmentModel.findOne({
    _id: req.body._id,
  }).exec();
  console.log(`found assessment: ${assessment}`);
  if (!assessment) {
    return res
      .status(204)
      .json({ message: `No assessment matches ID ${req.body.id}` });
  }

  if (req.body?.assessmentDate)
    assessment.assessmentDate = req.body.assessmentDate;
  if (req.body?.value) assessment.value = req.body.value;
  console.log(JSON.stringify(assessment));
  const result = await assessment.save();
  res.json(result);
}

export async function deleteAssessment(req: express.Request, res: express.Response){
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const assessment = await CriteriaAssessmentModel.findOne({
    _id: req.body.id,
  }).exec();

  if (!assessment) {
    return res
      .status(204)
      .json({ message: `No assessment matches ID ${req.body.id}` });
  }
  const result = await assessment.deleteOne({ _id: req.body.id });
  res.json(result);
};

export async function getAssessment(req: express.Request, res: express.Response) {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const assessment = await CriteriaAssessmentModel.findOne({
    _id: req.params.id,
  }).exec();
  if (!assessment) {
    return res
      .status(204)
      .json({ message: `No assessment matches ID ${req.body.id}` });
  }
  res.json(assessment);
};

export async function createCriteriaAssessment(req: express.Request, res: express.Response) {
  if (!req?.body?.id) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: "A criteria id is required" });
  }
  if (!req?.body?.assessmentDate) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: "An assessment date is required" });
  }

  if (!req?.body?.value) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: "A value is required" });
  }

  try {
    const criteria = await CriteriaDefinitionModel.findOne({_id: req.body.id}).exec();
    const result = await CriteriaAssessmentModel.create({
      assessmentDate: new Date(req.body.assessmentDate),
      criteria: criteria,
      value: req.body.value,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to create assessment");
  }
}

export async function createCriteriaAssessmentBatch(req: express.Request, res: express.Response) {
  if (!req?.body?.assessments) {
    return res.status(400).json({ message: "No assessments in request - it may be empty though" });
  }
  if (!Array.isArray(req?.body?.assessments)) {
    return res.status(400).json({ message: "Asssessments must be an array" });
  }

  let results: any = [];
  req.body.assessments.forEach((assessment: CriteriaAssessment) => {
    // const criteria = await CriteriaDefinitionModel.findOne({_id: assessment._id}).exec();
    // results.push(await CriteriaAssessmentModel.create({
    //   assessmentDate: new Date(assessment.assessmentDate),
    //   criteria: criteria,
    //   value: assessment.value,
    // }));s
    findCriteria(assessment._id.toString()).then()
  });
  res.json(results);
}

async function findCriteria(id: string) {
  return CriteriaAssessmentModel.findOne({_id: id});
}