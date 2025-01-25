export default function formChartData(
  labels: string[],
  dataset: number[],
  bgColors: string[],
  borderColor: string[] = bgColors,
  borderExists = true
) {
  return {
    labels: [...labels],
    datasets: [
      {
        label: '',
        data: [...dataset],
        backgroundColor: [...bgColors],
        borderColor: borderExists ? [...borderColor] : [],
      }
    ],
  };
}
