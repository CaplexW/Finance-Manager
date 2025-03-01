export default function roundToHundredths(number: number): number {
  return Math.round(number * 100) / 100;
}
