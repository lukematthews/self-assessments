import { Mongoose } from 'mongoose';
import { CriteriaAssessmentSchema } from './schemas/criteria-assessment.schema';

export const criteriaAssessmentsProviders = [
  {
    provide: 'CRITERIA_ASSESSMENTS_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('CriteriaAssessment', CriteriaAssessmentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
