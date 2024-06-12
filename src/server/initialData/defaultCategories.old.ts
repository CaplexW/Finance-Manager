import { Types } from 'mongoose';
import { ReactElement } from 'react';
import {
  blueColor, blueLightColor, brownColor, cyanColor, grayColor, greenColor, greenLightColor, greenToxicColor, orangeColor, pinkColor, purpleColor, redColor, redSolidColor, violetColor, yellowColor
} from '../../constants/colors.ts';
import getIconByIdname from '../../utils/getIconByIdname.ts';



const defaultCategories:TDefaultCategory[] = [
  {
    displayName: 'Зарплата',
    color: blueColor,
    type: 'income',
    icon: await getIconByIdname('salary'),
    idName: "salary",
  },
  {
    displayName: 'Продукты',
    color: redColor,
    type: 'outcome',
    icon: await getIconByIdname('food'),
    idName: "food",
  },
  {
    displayName: 'Транспорт',
    color: yellowColor,
    type: 'outcome',
    icon: await getIconByIdname('bus'),
    idName: "bus",
  },
  {
    displayName: 'Гигиена',
    color: greenLightColor,
    type: 'outcome',
    icon: await getIconByIdname('hygiene'),
    idName: "hygiene",
  },
  {
    displayName: 'Здоровье',
    color: greenColor,
    type: 'outcome',
    icon: await getIconByIdname('health'),
    idName: "health",
  },
  {
    displayName: 'Жильё',
    color: grayColor,
    type: 'outcome',
    icon: await getIconByIdname('house'),
    idName: "house",
  },
  {
    displayName: 'Уход за собой',
    color: pinkColor,
    type: 'outcome',
    icon: await getIconByIdname('beauty'),
    idName: "beauty",
  },
  {
    displayName: 'Долги',
    color: redSolidColor,
    type: 'outcome',
    icon: await getIconByIdname('debt'),
    idName: "debt",
  },
  {
    displayName: 'Техника',
    color: orangeColor,
    type: 'outcome',
    icon: await getIconByIdname('tech'),
    idName: "tech",
  },
  {
    displayName: 'Развлечения',
    color: purpleColor,
    type: 'outcome',
    icon: await getIconByIdname('entertainment'),
    idName: "entertainment",
  },
  {
    displayName: 'Связь',
    color: blueLightColor,
    type: 'outcome',
    icon: await getIconByIdname('telecom'),
    idName: "telecom",
  },
  {
    displayName: 'Рестораны',
    color: cyanColor,
    type: 'outcome',
    icon: await getIconByIdname('cafe'),
    idName: "cafe",
  },
  {
    displayName: 'Одежда',
    color: violetColor,
    type: 'outcome',
    icon: await getIconByIdname('clothes'),
    idName: "clothes",
  },
  {
    displayName: 'Бытовая химия',
    color: greenToxicColor,
    type: 'outcome',
    icon: await getIconByIdname('detergents'),
    idName: "detergents",
  },
  {
    displayName: 'Разное',
    color: brownColor,
    type: 'outcome',
    icon: await getIconByIdname('other'),
    idName: "other",
  },
];

export default defaultCategories;

export type TDefaultCategory = {
  displayName: string,
  color: string,
  type: string,
  icon: Types.ObjectId,
  idName: string,
  user?: Types.ObjectId,
};
