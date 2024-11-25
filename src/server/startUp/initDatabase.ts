import Category from "../models/Category.ts";
import defaultCategories, { TDefaultCategory } from "../initialData/defaultCategories.ts";
import { Mongoose } from "mongoose";
import { redLog } from "../../utils/console/coloredLogs.ts";
import catchError from "../../utils/errors/catchError.ts";
import Icon, { IIcon } from "../models/Icon.ts";
import defaultIcons from "../initialData/defaultIcons.old.tsx";
import showElement from "../../utils/console/showElement.ts";
// import heroIconsNames from "../initialData/heroIconsNames.ts";
// import HeroIconName, { IHeroIconName } from "../models/heroIconName.ts";

export default async function initDatabase() {
    const icons = await Icon.find();
    const iconsExists: boolean = icons.length > 0;
    
    // const iconNames = await HeroIconName.find();
    // const namesExists: boolean = iconNames.length > 0;

    if (!iconsExists) await createInitialEntity(Icon, defaultIcons);
    // if (!namesExists) await createInitialEntity(HeroIconName, heroIconsNames);

    const categories = await Category.find();
    const categoriesExists: boolean = categories.length >= defaultCategories.length;

    if (!categoriesExists) createInitialEntity(Category, defaultCategories);
}

async function createInitialEntity(Model: Mongoose["Model"], mock: TDefaultCategory[] | IIcon[] | IHeroIconName[]) {
    showElement(Model, 'Model');
    Model.collection.drop();
    mock.forEach((item: TDefaultCategory | IIcon) => {
        try {
            const newItem = new Model(item);
            newItem.save().then((result: unknown) => result); //TODO уточнить тип
        } catch (err) {
            catchError(err);
            redLog(err);
        }
    });
}
