import { Schema, model, Types, HydratedDocument } from "mongoose";

const schema = {
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serialNumber: { type: Number, required: true },
  importConditions: {
    name: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    amount: { type: Number },
  },
  assignValues: {
    name: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    amount: { type: Number },
  },
};

const importPreset = new Schema(schema);
const ImportPreset = model('ImportPreset', importPreset);

export default ImportPreset;

export interface IImportPreset {
  user: Types.ObjectId;
  serialNumber: number;
  importConditions: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  };
  assignValues: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  };
}

export type TImportPreset = {
  user: Types.ObjectId;
  serialNumber: number;
  importConditions: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  };
  assignValues: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  };
};

export type ImportPresetDocument = HydratedDocument<{
  user: Types.ObjectId;
  serialNumber: number;
  importConditions: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  };
  assignValues: {
    name?: string;
    category?: Types.ObjectId;
    amount?: number;
  };
}>;
