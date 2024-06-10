import { ReactElement } from 'react';
import {
  blueColor, blueLightColor, brownColor, cyanColor, grayColor, greenColor, greenLightColor, greenToxicColor, orangeColor, pinkColor, purpleColor, redColor, redSolidColor, violetColor, yellowColor
} from '../../constants/colors.ts';
import {
  beautyIcon, busIcon, cafeIcon, clothesIcon, debtIcon, detergentsIcon, entertainmentIcon, foodIcon, healthIcon, houseIcon, hygieneIcon, otherIcon, salaryIcon, techIcon, telecomIcon
} from '../../constants/defaultIcons.tsx';


const defaultCategories:TDefaultCategory[] = [
  {
    name: 'Зарплата',
    color: blueColor,
    type: 'income',
    icon: salaryIcon,
  },
  {
    name: 'Продукты',
    color: redColor,
    type: 'outcome',
    icon: foodIcon,
  },
  {
    name: 'Транспорт',
    color: yellowColor,
    type: 'outcome',
    icon: busIcon,
  },
  {
    name: 'Гигиена',
    color: greenLightColor,
    type: 'outcome',
    icon: hygieneIcon,
  },
  {
    name: 'Здоровье',
    color: greenColor,
    type: 'outcome',
    icon: healthIcon,
  },
  {
    name: 'Жильё',
    color: grayColor,
    type: 'outcome',
    icon: houseIcon,
  },
  {
    name: 'Уход за собой',
    color: pinkColor,
    type: 'outcome',
    icon: beautyIcon,
  },
  {
    name: 'Долги',
    color: redSolidColor,
    type: 'outcome',
    icon: debtIcon,
  },
  {
    name: 'Техника',
    color: orangeColor,
    type: 'outcome',
    icon: techIcon,
  },
  {
    name: 'Развлечения',
    color: purpleColor,
    type: 'outcome',
    icon: entertainmentIcon,
  },
  {
    name: 'Связь',
    color: blueLightColor,
    type: 'outcome',
    icon: telecomIcon,
  },
  {
    name: 'Рестораны',
    color: cyanColor,
    type: 'outcome',
    icon: cafeIcon,
  },
  {
    name: 'Одежда',
    color: violetColor,
    type: 'outcome',
    icon: clothesIcon,
  },
  {
    name: 'Бытовая химия',
    color: greenToxicColor,
    type: 'outcome',
    icon: detergentsIcon,
  },
  {
    name: 'Разное',
    color: brownColor,
    type: 'outcome',
    icon: otherIcon,
  },
];

export default defaultCategories;

export type TDefaultCategory = {
  name: string,
  color: string,
  type: string,
  icon: ReactElement,
};
