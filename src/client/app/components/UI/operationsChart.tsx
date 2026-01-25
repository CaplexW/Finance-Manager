import React from 'react';
import { useSelector } from 'react-redux';
import { getCategoriesList } from '../../store/categories';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../server/utils/console/showElement';
import sortOperationsByAmount from '../../utils/sortOperationsByAmount';
import { Operation } from '../../../types/types';
import { clrTransWhite600, greenColor, redColor } from '../../constants/colors';
import Chart from '../common/charts/chart';

interface OperationsChartProps {
  operations: Operation[];
  switchPosition?: string | null;
  type?: string;
}

export default function OperationsChart({ operations, switchPosition = null, type = 'doughnut' }: OperationsChartProps) {
  const allCategories = useSelector(getCategoriesList());

  if (!operations?.length || !allCategories?.length) return null;

  const sortedOperations = sortOperationsByAmount(operations);

  function createDataForChart(operations: Operation[], categories: any[]) {
    const dataObject = {
      labels: [] as string[],
      datasets: [
        {
          label: '',
          data: [] as number[],
          backgroundColor: [] as string[],
          borderColor: [] as string[],
          borderWidth: 0,
        }
      ],
    };
    operations.forEach((op) => {
      const operationCategory = categories.find((c) => c._id === op.category);
      if (!operationCategory) return;
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
        }
        else {
          dataset.backgroundColor.push(operationCategory.color);
        }
      }
    });
    const categoryObjects = dataObject.datasets[0].data.map((amount, index) => ({
      amount,
      color: dataObject.datasets[0].backgroundColor[index],
      name: dataObject.labels[index],
    }));
    const sortedObjects = sortOperationsByAmount(categoryObjects, 'desc');

    dataObject.labels = [];
    dataObject.datasets[0].data = [];
    dataObject.datasets[0].backgroundColor = [];
    sortedObjects.forEach((object) => {
      dataObject.labels.push(object.name);
      dataObject.datasets[0].data.push(object.amount);
      dataObject.datasets[0].backgroundColor.push(object.color);
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

    padding: '5%',

    width: '',

    display: 'flex',
    flexGrow: '1',
    minHeight: '0',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div className="" style={containerSyles}>
      <Chart data={data} options={options} type={type} />
    </div>
  );
}




