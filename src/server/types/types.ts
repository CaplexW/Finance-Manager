import { Types } from "mongoose";

export interface ImportPreset {
  _id: Types.ObjectId;
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

export interface User {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  currentBalance: number;
  categories: Types.ObjectId[];
  accounts: Types.ObjectId[];
  goals: Types.ObjectId[];
  operations: Types.ObjectId[];
  image: string | null;
}

export interface Operation {
  _id: Types.ObjectId;
  name: string;
  amount: number;
  category: Types.ObjectId;
  date: string;
  user: Types.ObjectId;
  time?: string;
  balanceBefore?: number;
  balanceAfter?: number;
}

export interface Category {
  _id: Types.ObjectId;
  name: string;
  color: string;
  isIncome: boolean;
  icon: Types.ObjectId;
  user: Types.ObjectId;
}

export interface Account {
  _id: Types.ObjectId;
  name: string;
  type: 'savings' | 'credit' | 'deposit' | 'debit';
  currentBalance: number;
  user: Types.ObjectId;
  goal: Types.ObjectId;
  percent: number;
  image: string;
}

export interface Goal {
  _id: Types.ObjectId;
  name: string;
  goalPoint: number;
  status: 'complete' | 'in progress' | 'abandoned';
  user: Types.ObjectId;
  account: Types.ObjectId;
}

export interface Icon {
  _id: Types.ObjectId;
  name: string;
  src: object;
}
