import { Mongoose } from 'mongoose';
import { CriteriaAssessmentSchema } from 'src/criteria-assessments/schemas/criteria-assessment.schema';
import { CriteriaSchema } from 'src/criterias/schemas/criteria.schema';

export const criteriasProviders = [
  {
    provide: 'CRITERIA_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('CriteriaDefinition', CriteriaSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CRITERIA_ASSESSMENTS_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('CriteriaAssessment', CriteriaAssessmentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
