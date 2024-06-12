import { ReactElement } from 'react';
import {
  blueColor, blueLightColor, brownColor, cyanColor, grayColor, greenColor, greenLightColor, greenToxicColor, orangeColor, pinkColor, purpleColor, redColor, redSolidColor, violetColor, yellowColor
} from '../../constants/colors.ts';
import {
  beautyIcon, busIcon, cafeIcon, clothesIcon, debtIcon, detergentsIcon, entertainmentIcon, foodIcon, healthIcon, houseIcon, hygieneIcon, otherIcon, salaryIcon, techIcon, telecomIcon
} from './defaultIcons.tsx';


const defaultCategories:TDefaultCategory[] = [
  {
    name: 'Зарплата',
    color: blueColor,
    isIncome: true,
    icon: salaryIcon,
  },
  {
    name: 'Продукты',
    color: redColor,
    isIncome: false,
    icon: foodIcon,
  },
  {
    name: 'Транспорт',
    color: yellowColor,
    isIncome: false,
    icon: busIcon,
  },
  {
    name: 'Гигиена',
    color: greenLightColor,
    isIncome: false,
    icon: hygieneIcon,
  },
  {
    name: 'Здоровье',
    color: greenColor,
    isIncome: false,
    icon: healthIcon,
  },
  {
    name: 'Жильё',
    color: grayColor,
    isIncome: false,
    icon: houseIcon,
  },
  {
    name: 'Уход за собой',
    color: pinkColor,
    isIncome: false,
    icon: beautyIcon,
  },
  {
    name: 'Долги',
    color: redSolidColor,
    isIncome: false,
    icon: debtIcon,
  },
  {
    name: 'Техника',
    color: orangeColor,
    isIncome: false,
    icon: techIcon,
  },
  {
    name: 'Развлечения',
    color: purpleColor,
    isIncome: false,
    icon: entertainmentIcon,
  },
  {
    name: 'Связь',
    color: blueLightColor,
    isIncome: false,
    icon: telecomIcon,
  },
  {
    name: 'Рестораны',
    color: cyanColor,
    isIncome: false,
    icon: cafeIcon,
  },
  {
    name: 'Одежда',
    color: violetColor,
    isIncome: false,
    icon: clothesIcon,
  },
  {
    name: 'Бытовая химия',
    color: greenToxicColor,
    isIncome: false,
    icon: detergentsIcon,
  },
  {
    name: 'Разное',
    color: brownColor,
    isIncome: false,
    icon: otherIcon,
  },
];

export default defaultCategories;

export type TDefaultCategory = {
  name: string,
  color: string,
  isIncome: boolean,
  icon: ReactElement,
};
