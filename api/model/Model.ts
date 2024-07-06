import { model, Schema } from "mongoose";

export interface Criteria {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
}

export interface CriteriaAssessment {
  _id: Schema.Types.ObjectId;
  assessmentDate: Date;
  value: string;
  criteria: Criteria;
}

const criteriaDefinitionSchema = new Schema<Criteria>({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const criteriaAssessmentSchema: Schema = new Schema({
  // _id: { type: Schema.Types.ObjectId, required: true },
  assessmentDate: {
    type: Date,
    required: true,
  },
  value: {
    type: String,
    required: false,
  },
  criteria: {
    type: Schema.Types.ObjectId,
    ref: "CriteriaDefinition",
  },
});

export const CriteriaDefinitionModel = model("CriteriaDefinition", criteriaDefinitionSchema);
export const CriteriaAssessmentModel = model("CriteriaAssessment", criteriaAssessmentSchema);
