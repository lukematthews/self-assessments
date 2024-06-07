const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CriteriaDefinition = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const CriteriaAssessment = new Schema({
    assessmentDate: {
      type: Date,
      required: true,
    },
    value: {
      type: String,
      required: false,
    },
    criteria: {
      type: mongoose.ObjectId,
      ref: 'CriteriaDefinition'
    }
  });
  
module.exports = {
    CriteriaDefinition, CriteriaAssessment
};
