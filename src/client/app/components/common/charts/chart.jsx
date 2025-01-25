import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Doughnut, Line, Pie } from "react-chartjs-2";


ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
);
const optionsWithNoLegend = {
  plugins: {
    legend: {
      display: false,
    },
  },
};;

export default function Chart({ data, type = 'pie', options = optionsWithNoLegend }) {
  if (!data) return;

  if (type === 'doughnut') return <Doughnut data={data} options={options} />;
  if (type === 'pie') return <Pie data={data} options={options} />;
  if (type === 'line') return <Line data={data} options={options} />;
};

Chart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.number),
      backgroundColor: PropTypes.arrayOf(PropTypes.string),
      borderColor: PropTypes.arrayOf(PropTypes.string),
      borderWidth: PropTypes.number,
    }))
  }).isRequired,
  options: PropTypes.shape({
    plugins: PropTypes.shape({
      legend: PropTypes.shape({
        display: PropTypes.bool,
      }),
    }),
  }),
  type: PropTypes.string,
};
