import {
  blueColor, blueLightColor, brownColor, cyanColor, grayColor, greenColor, greenLightColor, greenToxicColor, orangeColor, pinkColor, purpleColor, redColor, redSolidColor, violetColor, yellowColor
} from '../constants/colors.ts';


const defaultCategories:Category[] = [
  {
    name: 'Зарплата',
    color: blueColor,
    type: 'income',
  },
  {
    name: 'Продукты',
    color: redColor,
    type: 'outcome',
  },
  {
    name: 'Транспорт',
    color: yellowColor,
    type: 'outcome',
  },
  {
    name: 'Гигиена',
    color: greenLightColor,
    type: 'outcome',
  },
  {
    name: 'Здоровье',
    color: greenColor,
    type: 'outcome',
  },
  {
    name: 'Жильё',
    color: grayColor,
    type: 'outcome',
  },
  {
    name: 'Красота',
    color: pinkColor,
    type: 'outcome',
  },
  {
    name: 'Долги',
    color: redSolidColor,
    type: 'outcome',
  },
  {
    name: 'Техника',
    color: orangeColor,
    type: 'outcome',
  },
  {
    name: 'Развлечения',
    color: purpleColor,
    type: 'outcome',
  },
  {
    name: 'Связь',
    color: blueLightColor,
    type: 'outcome',
  },
  {
    name: 'Рестораны',
    color: cyanColor,
    type: 'outcome',
  },
  {
    name: 'Бытовая химия',
    color: greenToxicColor,
    type: 'outcome',
  },
  {
    name: 'Одежда',
    color: violetColor,
    type: 'outcome',
  },
  {
    name: 'Разное',
    color: brownColor,
    type: 'outcome',
  },
];

export default defaultCategories;

type Category = {
  name: string,
  color: string,
  type: string,
};
