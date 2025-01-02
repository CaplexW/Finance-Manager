import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import User from "../db/models/User.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "./console/showElement.ts";

export default async function getCategoriesForUser(id: string) {
  const user = await User.findById(id);
  if (!user) return null;

  const userCategories = await User.aggregate(createPipelineForUserCategories(user._id));
  return userCategories;
}

// Пайплайн для агрегации
function createPipelineForUserCategories(userId: Types.ObjectId) {
  const findUser = { $match: { _id: userId } };

  ///////////////////////////////////////////////////////////////
  const findUserCategoriesFrom = (collection: 'categories' | 'defaultcategories') => {
    return {
      $lookup: {
        from: collection,
        let: { userCategories: "$categories" },
        pipeline: [{ $match: { $expr: { $in: ["$_id", "$$userCategories"] } } }],
        as: "foundCategories",
      },
    };
  };

  //////////////////////////////////////////////////////////////
  const unpackFoundCategories = { $unwind: "$foundCategories" };
  const replaceRootWithFoundCateogies = { $replaceRoot: { newRoot: "$foundCategories" } };

  //////////////////////////////////////////////////////////////
  const findUsersCategories = {
    $facet: {
      defaultCategories: [
        findUserCategoriesFrom('defaultcategories'),
        unpackFoundCategories,
        replaceRootWithFoundCateogies,
      ],
      customCategories: [
        findUserCategoriesFrom('categories'),
        unpackFoundCategories,
        replaceRootWithFoundCateogies,
      ],
    }
  };
  const combineUserCategories = {
    $project: {
      userCategories: {
        $concatArrays: ["$customCategories", "$defaultCategories"],
      }
    }
  };
  const unpackUserCategories = { $unwind: "$userCategories" };
  const replaceRootWithUserCategories = { $replaceRoot: { newRoot: "$userCategories" } };

  //////////////////////////////////////////////////////////////;
  
  return [
    findUser,
    findUsersCategories,
    combineUserCategories,
    unpackUserCategories,
    replaceRootWithUserCategories,
  ];
}


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

const copiedFromCompas = [
  [
    {
      '$match': {
        '_id': new ObjectId('677261e537d70f36bd198082')
      }
    }, {
      '$facet': {
        'defaultCategories': [
          {
            '$lookup': {
              'from': 'defaultcategories', 
              'let': {
                'userCategories': '$categories'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$in': [
                        '$_id', '$$userCategories'
                      ]
                    }
                  }
                }
              ], 
              'as': 'foundCategories'
            }
          }, {
            '$unwind': '$foundCategories'
          }, {
            '$replaceRoot': {
              'newRoot': '$foundCategories'
            }
          }
        ], 
        'customCategories': [
          {
            '$lookup': {
              'from': 'categories', 
              'let': {
                'userCategories': '$categories'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$in': [
                        '$_id', '$$userCategories'
                      ]
                    }
                  }
                }
              ], 
              'as': 'foundCategories'
            }
          }, {
            '$unwind': '$foundCategories'
          }, {
            '$replaceRoot': {
              'newRoot': '$foundCategories'
            }
          }
        ]
      }
    }
  ]
];
