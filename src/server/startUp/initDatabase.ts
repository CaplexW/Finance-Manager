import defaultCategories from "../../db/initialData/defaultCategories.ts";
import { Document, Mongoose } from "mongoose";
import { redLog } from "../../utils/console/coloredLogs.ts";
import catchError from "../../utils/errors/catchError.ts";
import Icon, { TIcon } from "../../db/models/Icon.ts";
import defaultIcons from "../../db/initialData/defaultIcons.tsx";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from "../../utils/console/showElement.ts";
import DefaultCategory, { TDefaultCategory } from "../../db/models/DefaultCategory.ts";
import forEachAsync from "../../utils/iterators/forEachAsync.ts";

export default async function initDatabase() {
    const icons = await Icon.find();
    const iconsExists: boolean = icons.length > 0;
    if (!iconsExists) {
        await createCollection<TIcon>(Icon, defaultIcons);
        if (icons && icons.length) await normolizeIconColor(icons);
    }

    const existingCategories = await DefaultCategory.find();
    const categoriesExists: boolean = existingCategories.length >= defaultCategories.length;
    if (!categoriesExists) {
        await createCollection<TDefaultCategory>(DefaultCategory, defaultCategories);
        await giveIconsToDefaultCategories();
    }
}


async function createCollection<T>(Model: Mongoose["Model"], source: T[]) {
    await Model.collection.drop();

    await forEachAsync(source, async (item) => {
            try {
                const newItem: Document<unknown, object, T> = new Model(item);
                await newItem.save();
            } catch (err) {
                catchError(err);
                redLog(err);
            }
        });
}
async function normolizeIconColor(iconDocuments: (Document<unknown, object, TIcon>)[]) {
    const goalValue = 'currentColor';
    iconDocuments.forEach(async (icon) => {
        const object = icon.src.props;

        if (object.fill) {
            object.fill = goalValue;

            icon.markModified('src');
            icon.save();

            return;
        }

        if (object.children) {
            await changeFillOnChildren(object.children);

            icon.markModified('src');
            icon.save();
            
            return;
        }
    });

}
async function changeFillOnChildren(children: SVGChild | SVGChild[], changeValue: string = 'currentColor') {
    if (!Array.isArray(children) && children.props?.fill) children.props.fill = changeValue;
    if (Array.isArray(children)) {
        await forEachAsync(children, async (child) => {
            try {
                await changeFillOnChildren(child);
            } catch (err) {
                catchError(err);
                redLog(err);
            }
        });

        return;
    }
    if (children.props?.children) {
        await changeFillOnChildren(children.props.children);
        return;
    }

    return;
}
async function giveIconsToDefaultCategories() {
    const icons = await Icon.find();
    const existingCategories = await DefaultCategory.find();

    existingCategories.forEach((cat) => {
        const categoryIcon = icons.find((i) => i.name === cat.iconName);
        cat.icon = categoryIcon?._id;
        cat.save();
    });
}

type SVGChild = {
    props: {
        fill?: string,
        children?: SVGChild;
    }
};
