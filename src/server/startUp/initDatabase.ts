import Category from "../models/Category.ts";
import defaultCategories, { TDefaultCategory } from "../initialData/defaultCategories.ts";
import { Mongoose } from "mongoose";
import { redLog } from "../../utils/console/coloredLogs.ts";
import catchError from "../../utils/catchError.ts";
import Icon, { IIcon } from "../models/Icon.ts";
import defaultIcons from "../initialData/defaultIcons.old.tsx";

export default async function initDatabase() {
    const icons = await Icon.find();
    const iconsExists:boolean = icons.length > 0;

    if (!iconsExists) await createInitialEntity(Icon, defaultIcons);

    const categories = await Category.find();
    const categoriesExists:boolean = categories.length > 0;

    if (!categoriesExists) createInitialEntity(Category, defaultCategories);
}

async function createInitialEntity(Model:Mongoose["Model"], mock:TDefaultCategory[] | IIcon[]) {
    mock.forEach((item:TDefaultCategory | IIcon) => {
        try {
            const newItem = new Model(item);
            newItem.save().then((result:unknown) => result); //TODO specify type 
        } catch(err) {
            catchError(err);
            redLog(err);
        }
    });
}
