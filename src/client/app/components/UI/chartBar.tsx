import React from 'react';
import { Operation, Category, Icon } from '../../../types/types';
import OperationsChart from './operationsChart';
import CategoriesList from './categoriesList';
import ContentBoard from '../common/contentBoard';

interface ChartBarProps {
  operations: Operation[];
  onClick: (list: string[]) => void;
  categories?: Array<{
    category: Category;
    icon: Icon;
    amount: number;
    isFiltered: boolean;
  }>;
}

export default function ChartBar({ operations, onClick, categories }: ChartBarProps) {
  return (
    <ContentBoard header={<h4>Соотношение категорий</h4>}>
      <div className="side-container">
        {categories && <CategoriesList onClick={onClick} categories={categories} />}
        <OperationsChart operations={operations} />
      </div>
    </ContentBoard>
  );
}

