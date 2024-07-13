import { Document, Schema } from 'mongoose';
import { Criteria } from 'src/criterias/interfaces/criteria.interface';

export interface CriteriaAssessment extends Document {
  _id: Schema.Types.ObjectId;
  assessmentDate: Date;
  value: string;
  criteria: Criteria;
}
