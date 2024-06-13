const Model = require("../model/Model");
const f = require("date-fns/format");
const p = require("date-fns/parseISO");

const getAssessmentList = async (req, res) => {
  console.log("Get Items");
  const items = await Model.CriteriaAssessment.find();
  const criteria = await Model.CriteriaDefinition.find();

  const criteriaMap = criteria.reduce((map, item) => {
    map[item._id.toString()] = item;
    return map;
  }, {});

  const uiItems = items.map((assessment) => {
    return {
      id: assessment.id,
      title: criteriaMap[assessment.criteria].title,
      criteriaId: criteriaMap[assessment.criteria]._id,
      assessmentDate: assessment.assessmentDate,
      value: assessment.value,
    };
  });

  // now group them by day...
  let groupedAssessments = uiItems.reduce((map, item) => {
    const assessmentDate = f.format(
      new Date(item.assessmentDate),
      "yyyy-MM-dd"
    );
    if (!map[assessmentDate]) {
      map[assessmentDate] = [];
    }
    map[assessmentDate].push(item);
    return map;
  }, {});

  groupedAssessments = Object.keys(groupedAssessments).map((dateKey, index) => {
    return {
      id: index,
      assessmentDate: dateKey,
      title: groupedAssessments[dateKey].map((item) => item.title).join(", "),
      assessments: groupedAssessments[dateKey].map((assessment) => {
        return { id: assessment.id, title: assessment.title, criteriaId: assessment.criteriaId };
      }),
    };
  });

  if (!groupedAssessments) {
    return res.statusCode(204).json({ message: "No items found" });
  }
  res.json(groupedAssessments);
};

const getAssessmentsGroupedByDate = async (req, res) => {
  console.log("Get Items");
  const items = await Model.CriteriaAssessment.find();
  const criteria = await Model.CriteriaDefinition.find();

  const criteriaMap = criteria.reduce((map, item) => {
    map[item._id.toString()] = item;
    return map;
  }, {});

  const uiItems = items.map((assessment) => {
    return {
      id: assessment.id,
      title: criteriaMap[assessment.criteria].title,
      assessmentDate: assessment.assessmentDate,
      value: assessment.value,
    };
  });

  // now group them by day...
  let groupedAssessments = uiItems.reduce((map, item) => {
    const assessmentDate = f.format(
      new Date(item.assessmentDate),
      "yyyy-MM-dd"
    );
    if (!map[assessmentDate]) {
      map[assessmentDate] = [];
    }
    map[assessmentDate].push(item);
    return map;
  }, {});

  if (!groupedAssessments) {
    return res.statusCode(204).json({ message: "No items found" });
  }
  res.json(groupedAssessments);
};

const getAssessmenetsForDate = async (req, res) => {};

const getAssessment = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const assessment = await Model.CriteriaAssessment.findOne({
    _id: req.params.id,
  }).exec();
  if (!assessment) {
    return res
      .status(204)
      .json({ message: `No assessment matches ID ${req.body.id}` });
  }
  const criteria = await Model.CriteriaDefinition.findOne({
    _id: assessment.criteria._id,
  });
  let renderedAssessment = {
    assessmentDate: assessment.assessmentDate,
    value: assessment.value,
    criteria: {
      formattedDescription: `***${criteria.title}*** ${criteria.description}`,
      title: criteria.title,
      description: criteria.description,
      ...criteria,
    },
  };
  res.json(renderedAssessment);
};

const editAssessment = async (req, res) => {
  console.log(req.params);
  const assessment = await Model.Assessment.findById(req.params.id).exec();
  // handle assessment not found!
  if (!assessment || assessment === null)
    return res.status(404).json("Could not find assessment with provided id");
  console.log(`assessmentDate: ${assessment.assessmentDate}`);
  assessment._doc.assessmentDate = f.format(
    assessment.assessmentDate,
    "yyyy-MM-dd"
  );
  console.log(req.params);
  res.json(assessment);
};

const newAssessmentTemplate = async (req, res) => {
  const refItems = await Model.ItemRef.find();
  res.json({ items: refItems });
};

const getItemRefs = async (req, res) => {
  let items = await Model.CriteriaDefinition.find();
  items = items.map((item) => {
    return {
      formattedDescription: `***${item.title}*** ${item.description}`,
      title: item.title,
      description: item.description,
      _id: item._id,
    };
  });
  res.json(items);
};

module.exports = {
  getAssessmentList,
  editAssessment,
  newAssessmentTemplate,
  getItemRefs,
  getAssessmentsGroupedByDate,
  getAssessment,
};
