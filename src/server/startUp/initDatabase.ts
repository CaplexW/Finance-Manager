import Category from "../models/Category.ts";
import defaultCategories, { TDefaultCategory } from "../initialData/defaultCategories.ts";
import { Mongoose } from "mongoose";

export default async function initDatabase() {
    const categories = await Category.find();
    const categoriesExists:boolean = categories.length > 0;

    if (!categoriesExists) await createInitialEntity(Category, defaultCategories);
}

async function createInitialEntity(model:Mongoose["Model"], mock:TDefaultCategory[]) {
    await model.collection.drop();
    mock.forEach((item:TDefaultCategory) => {
        try {
            const newItem = new model(item);
            newItem.save().then((result:unknown) => result); //TODO specify tyoe
        } catch(err) {
            console.log(err);
        }
    });
}
