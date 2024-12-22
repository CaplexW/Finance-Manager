import { isValidObjectId, Types } from "mongoose";
import { ObjectId } from 'mongodb';
import User from "../db/models/User.ts";
import Category from "../db/models/Category.ts";
import DefaultCategory from "../db/models/DefaultCategory.ts";
import showElement from "./console/showElement.ts";

export default async function getCategoriesForUser(id: string) {
  const user = await User.findById(id);
  if (!user) return null;

  const userCategoriesPipeline = [
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: "categories",
        let: { userCategories: "$categories" },
        pipeline: [{ $match: { $expr: { $in: ['$_id', "$$userCategories"] } } }],
        as: 'categories',
      }
    },
    { $unwind: '$categories' },
    { $replaceRoot: { newRoot: "$categories" } },
  ];

  // const userCategories = await DefaultCategory.aggregate(createPipeline(user._id, user.categories));
  const userCategories = await User.aggregate(userCategoriesPipeline);
  // TODO переписать обращаясь к User, а не DefaultCategory.
  return userCategories;
}

// Пайплайн для агрегации
function createPipeline(userId: Types.ObjectId, userCategories: Types.ObjectId[]) {
  const findUserDefaultCategories = { $match: { _id: { $in: userCategories } } };
  const findUserCustomCategories = {
    $lookup: {
      from: "categories",
      pipeline: [{ $match: { _id: { $in: userCategories } } }],
      as: "categories",
    }
  };
  const limitByOne = { $limit: 1 };
  const haveLocalCopy = {
    $and: [
      { $eq: ["$originalSource", "$$defaultId"] },
      { $eq: ["$user", userId] },
    ],
  };
  const findLocalCopies = {
    $lookup: {
      from: "categories",
      let: { defaultId: "$_id" },
      pipeline: [{ $match: { $expr: haveLocalCopy } }],
      as: "localCopy",
    },
  };
  const setResult = {
    $addFields: {
      result: {
        $cond: [
          { $gt: [{ $size: "$localCopy" }, 0] },
          { $arrayElemAt: ["$localCopy", 0] },
          "$$ROOT",
        ],
      },
    },
  };
  const replaceRootWithResult = { $replaceRoot: { newRoot: "$result" } };
  const joinDefaultAndCustomCategories = {
    $project: {
      allResults:
        { $concatArrays: ["$defaultCategories", "$categories"] }
    }
  };
  const unpackCategoryArrays = { $unwind: "$allResults" };
  const replaceRootWithResults = { $replaceRoot: { newRoot: "$allResults" } };
  const findUserDefaultAndCustomCategories = {
    $facet: {
      defaultCategories: [
        findUserDefaultCategories,
        findLocalCopies,
        setResult,
        replaceRootWithResult,
      ],
      categories: [
        findUserCustomCategories,
        limitByOne,
        { $unwind: "$categories" },
        { $replaceRoot: { newRoot: "$categories" } },
      ],
    },
  };
  const pipeline = [
    findUserDefaultAndCustomCategories,
    joinDefaultAndCustomCategories,
    unpackCategoryArrays,
    replaceRootWithResults,
  ];

  return pipeline;
}
