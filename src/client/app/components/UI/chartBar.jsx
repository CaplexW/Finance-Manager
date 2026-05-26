import React from 'react';
import OperationsChart from './operationsChart';
import CategoriesList from './categoriesList';

export default function ChartBar({ operations, onClick }) {
  return (
    <ContentBoard header={<h4>Соотношение категорий</h4>}>
      <div className="side-container">
        <CategoriesList onClick={onClick} operations={operations} />
        <OperationsChart operations={operations} />
      </div>
    </ContentBoard>
  );
};
