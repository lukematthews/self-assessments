import { Criteria } from 'src/criterias/entities/criteria.entity';
import { Schema } from 'mongoose';

export class CriteriaAssessment {
  _id: Schema.Types.ObjectId;
  assessmentDate: Date;
  value: string;
  criteria: Criteria;
}
