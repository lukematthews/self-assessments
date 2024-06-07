const Model = require("../model/Model");

const getAllAssessments = async (req, res) => {
  console.log("Get Assessments");
  const assessments = await Model.CriteriaAssessment.find()
    .sort({assessmentDate: "desc"})
    .exec();
  if (!assessments) {
    return res.statusCode(204).json({ message: "No assessments found" });
  }
  res.json(assessments);
};

const updateAssessment = async (req, res) => {
  console.log("Updating assessment");
  if (!req?.body?._id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const assessment = await Model.CriteriaAssessment.findOne({
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
};

const deleteAssessment = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const assessment = await Model.CriteriaAssessment.findOne({
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

const getAssessment = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const assessment = await Model.Assessment.findOne({
    _id: req.params.id,
  }).exec();
  if (!assessment) {
    return res
      .status(204)
      .json({ message: `No assessment matches ID ${req.body.id}` });
  }
  res.json(assessment);
};

const createCriteriaAssessment = async (req, res) => {
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
    const criteria = await Model.CriteriaDefinition.findOne({_id: req.body.id}).exec();
    const result = await Model.CriteriaAssessment.create({
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


const createCriteriaAssessmentBatch = async (req, res) => {
  if (!req?.body?.assessments) {
    return res.status(400).json({ message: "No assessments in request - it may be empty though" });
  }
  if (!Array.isArray(req?.body?.assessments)) {
    return res.status(400).json({ message: "Asssessments must be an array" });
  }

  let results = [];
  for await (assessment of req.body.assessments) {
    const criteria = await Model.CriteriaDefinition.findOne({_id: assessment.id}).exec();
    results.push(await Model.CriteriaAssessment.create({
      assessmentDate: new Date(assessment.assessmentDate),
      criteria: criteria,
      value: assessment.value,
    }));
  };
  res.json(results);
}

// const createCriteriaAssessment = async (req, res) => {
//   const validationResult = validateCriteriaAssessment(req.body);
//   if (validationResult.length > 0) {
//     return res
//       .status(400)
//       .json({ messages: validationResult });

//   }

//   try {
//     const criteria = await Model.CriteriaDefinition.findOne({_id: req.body.id}).exec();
//     const result = await Model.CriteriaAssessment.create({
//       assessmentDate: new Date(req.body.assessmentDate),
//       criteria: criteria,
//       value: req.body.value,
//     });
//     console.log(result);
//     res.status(201).json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Failed to create assessment");
//   }
// }

// function validateCriteriaAssessment(assessment) {
//   let results = [];
//   if (!assessment.id) {
//     results.push("A criteria id is required");
//   }
//   if (!assessment.assessmentDate) {
//     results.push("An assessment date is required");
//   }

//   if (!assessment.value) {
//     results.push("An value is required");
//   }
//   return results;
// }


module.exports = {
  getAllAssessments,
  updateAssessment,
  deleteAssessment,
  getAssessment,
  createCriteriaAssessment,
  createCriteriaAssessmentBatch
};
