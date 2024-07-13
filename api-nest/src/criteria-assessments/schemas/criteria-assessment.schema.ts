import { Schema } from 'mongoose';
import { CriteriaAssessment } from '../interfaces/criteria-assessments.interface';

export const CriteriaAssessmentSchema = new Schema<CriteriaAssessment>({
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
    ref: 'CriteriaDefinition',
  },
});
