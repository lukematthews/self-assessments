import { Schema } from 'mongoose';
import { Criteria } from '../interfaces/criteria.interface';

export const CriteriaSchema = new Schema<Criteria>({
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
