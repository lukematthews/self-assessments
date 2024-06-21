const Model = require("../model/Model");

const getAllCriteria = async (req, res) => {
  console.log("Get Criteria");
  const items = await Model.CriteriaDefinition.find();
  if (!items) {
    return res.statusCode(204).json({ message: "No items found" });
  }
  res.json(items);
};

const createNewItems = async (req, res) => {
  if (!req?.body?.items) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: "Items are required" });
  }

  try {
    let results = [];

    await req.body.items.reduce(async (promise, item) => {
      // This line will wait for the last async function to finish.
      // The first iteration uses an already resolved Promise
      // so, it will immediately continue.
      await promise;
      const contents = await Model.CriteriaDefinition.create({title: item.title, description: item.description});
      results.push(contents);
      console.log(contents);
    }, Promise.resolve());

    console.log(results);
    res.status(201).json(results);
  } catch (err) {
    console.error(err);
  }
};

const updateCriteria = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const criteria = await Model.CriteriaDefinition.findOne({ _id: req.body.id }).exec();

  if (!criteria) {
    return res
      .status(204)
      .json({ message: `No criteria matches ID ${req.body.id}` });
  }

  if (req.body?.description)
    criteria.description = req.body.description;
  const result = await criteria.save();
  res.json(result);
};

const deleteCriteria = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const criteria = await Model.CriteriaDefinition.findOne({ _id: req.body.id }).exec();

  if (!criteria) {
    return res
      .status(204)
      .json({ message: `No criteria matches ID ${req.body.id}` });
  }
  const result = await criteria.deleteOne({ _id: req.body.id });
  res.json(result);
};

const deleteAll = async (req, res) => {
  const result = Model.CriteriaDefinition.deleteMany().exec();
  res.json(result);
}

const getCriteria = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const criteria = await Model.CriteriaDefinition.findOne({ _id: req.params.id }).exec();
  if (!criteria) {
    return res
      .status(204)
      .json({ message: `No criteria matches ID ${req.body.id}` });
  }
  res.json(criteria);
};

module.exports = {
  getAllCriteria, createNewItems, updateCriteria, deleteCriteria, getCriteria, deleteAll
};
