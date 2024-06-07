const mongoose = require("mongoose");
const AssessmentSchemas = require("./Schema");

CriteriaDefinition = mongoose.model("CriteriaDefinition", AssessmentSchemas.CriteriaDefinition);
CriteriaAssessment = mongoose.model("CriteriaAssessment", AssessmentSchemas.CriteriaAssessment);

module.exports = {
    CriteriaDefinition, CriteriaAssessment
};
