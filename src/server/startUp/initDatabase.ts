import Category from "../models/Category.ts";
import defaultCategories, { TDefaultCategory } from "../initialData/defaultCategories.ts";
import { Mongoose } from "mongoose";
import { redLog } from "../../utils/console/coloredLogs.ts";

export default async function initDatabase() {
    const categories = await Category.find();
    const categoriesExists:boolean = categories.length > 0;

    if (!categoriesExists) await createInitialEntity(Category, defaultCategories);
}

async function createInitialEntity(Model:Mongoose["Model"], mock:TDefaultCategory[]) {
    await Model.collection.drop();
    mock.forEach((item:TDefaultCategory) => {
        try {
            const newItem = new Model(item);
            newItem.save().then((result:unknown) => result); //TODO specify tyoe
        } catch(err) {
            redLog(err);
        }
    });
}
