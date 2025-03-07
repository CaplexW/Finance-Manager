import {
  blueColor, blueLightColor, brownColor, cyanColor, grayColor, greenColor, greenLightColor, greenToxicColor, orangeColor, pinkColor, purpleColor, redColor, redSolidColor, violetColor, yellowColor
} from '../../client/app/constants/colors.ts';
import { TDefaultCategory } from '../models/DefaultCategory.ts';


const defaultCategories:TDefaultCategory[] = [
  {
    name: 'Зарплата',
    iconName: "money",
    color: blueColor,
    isIncome: true,
    icon: null,
  },
  {
    name: 'Продукты',
    iconName: "food",
    color: '#AD0000',
    isIncome: false,
    icon: null,
  },
  {
    name: 'Транспорт',
    iconName: "bus",
    color: yellowColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Гигиена',
    iconName: "hygiene",
    color: greenLightColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Здоровье',
    iconName: "heart",
    color: greenColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Жильё',
    iconName: "house",
    color: grayColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Уход за собой',
    iconName: "beauty",
    color: pinkColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Долги',
    iconName: "debt",
    color: redSolidColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Техника',
    iconName: "debt",
    color: orangeColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Развлечения',
    iconName: "joystick",
    color: purpleColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Связь',
    iconName: "telephone",
    color: blueLightColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Рестораны',
    iconName: "cafe",
    color: cyanColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Одежда',
    iconName: "clothes",
    color: violetColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Бытовая химия',
    iconName: "detergents",
    color: greenToxicColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Разное',
    iconName: "other",
    color: brownColor,
    isIncome: false,
    icon: null,
  },
  {
    name: 'Переводы',
    iconName: "credit-card",
    color: 'red',
    isIncome: false,
    icon: null,
  },
  {
    name: 'Поступления',
    iconName: "credit-card",
    color: 'green',
    isIncome: true,
    icon: null,
  },
  {
    name: 'Дом и Ремонт',
    iconName: "wrench",
    color: '#ff8624',
    isIncome: false,
    icon: null,
  },
  {
    name: 'Такси',
    iconName: "car",
    color: '#e5ff1f',
    isIncome: false,
    icon: null,
  },
];

export default defaultCategories;
