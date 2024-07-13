import { Mongoose } from 'mongoose';
import { CriteriaSchema } from './schemas/criteria.schema';

export const criteriasProviders = [
  {
    provide: 'CRITERIA_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('CriteriaDefinition', CriteriaSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
