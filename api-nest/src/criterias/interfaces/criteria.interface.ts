import { Document, ObjectId } from 'mongoose';

export interface Criteria extends Document<ObjectId> {
  title: string;
  description: string;
}
