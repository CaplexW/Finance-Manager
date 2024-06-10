import chalk from "chalk";
import { yellowColor } from "../../constants/colors.ts";

export function greenLog(message:unknown) {
  console.log(chalk.green(message));
}
export function redLog(message:unknown) {
  console.log(chalk.red(message));
}
export function yellowLog(message:unknown) {
  console.log(chalk.hex(yellowColor)(message));
}
export function cyanLog(message:unknown) {
  console.log(chalk.cyan(message));
}
