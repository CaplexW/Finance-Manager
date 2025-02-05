import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
import PropTypes from 'prop-types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../utils/console/showElement';
import { operationPropType } from '../../../../types/propTypes';
import { clrTransWhite600, greenColor, redColor } from '../../../../constants/colors';
import Chart from '../common/charts/chart';

export default function OperationsChart({ operations, switchPosition = null, type = 'doughnut' }) {
  const allCategories = useSelector(getCategoriesList());

  if (!operations || !allCategories) return;

  const sortedOperations = operations.toSorted((a, b) => a.amount - b.amount);

  function createDataForChart(operations, categories) {
    const dataObject = {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 0,
        }
      ],
    };
    operations.forEach((op) => {
      const operationCategory = categories.find((c) => c._id === op.category);
      const [dataset] = dataObject.datasets;
      const { labels } = dataObject;
      if (dataObject.labels.includes(operationCategory.name)) {
        const index = dataObject.labels.findIndex((label) => label === operationCategory.name);
        dataset.data[index] += Math.abs(op.amount);
      }
      else {
        labels.push(operationCategory.name);
        dataset.data.push(Math.abs(op.amount));
        if (switchPosition === 'both') {
          const typedColor = op.amount > 0 ? greenColor : redColor;
          dataset.backgroundColor.push(typedColor);
          // dataset.borderColor.push(typedColor);
        }
        else {
          dataset.backgroundColor.push(operationCategory.color);
          // dataset.borderColor.push(operationCategory.color);
        }
      }
    });

    return dataObject;
  }

  const data = createDataForChart(sortedOperations, allCategories);
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const containerSyles = {
    backgroundColor: clrTransWhite600,
    borderRadius: '8px',

    padding: '1rem 2.5rem',

    width: '100%',

    display: 'flex',
    flexGrow: '1',
    minHeight: '0',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const subStyles = {
    padding: '1rem 2.3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div className="" style={containerSyles}>
      {/* <div className="sub-container" style={subStyles}> */}
        <Chart data={data} options={options} type={type} />
      {/* </div> */}
    </div>
  );
};

OperationsChart.propTypes = {
  operations: PropTypes.arrayOf(PropTypes.shape(operationPropType)).isRequired,
  switchPosition: PropTypes.string,
  type: PropTypes.string,
};