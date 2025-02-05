export type ObjectId = string;

export interface BaseModel {
  _id: ObjectId;
  created_at?: Date;
  updated_at?: Date;
}