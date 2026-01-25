import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../utils/console/showElement';
import ContentBoard from '../common/contentBoard';
import WidgetIncomeOutcome from './widgets/widgetIncomeOutcome';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getOperationsList } from '../../store/operations';
import WidgetBiggestOperations from './widgets/widgetBiggestOperations';
import WidgetBalanceFlow from './widgets/widgetBalanceFlow';
import WidgetBiggestCategories from './widgets/widgetBiggestCategories';
import getSomeDaysAgoDate from '../../utils/date/getSomeDaysAgoDate';
import { getLoginStatus } from '../../store/user';
import { Operation } from '../../types/types';

export default function ActivityBoard(): JSX.Element | null {
  const [activityRange, setActivityRange] = useState<number>(30);
  const userIsLogged = useAppSelector(getLoginStatus());
  const operations = useAppSelector(getOperationsList()) as Operation[];

  if (!userIsLogged) return null;

  const relevantOperations = operations.filter((op) => {
    const operationDate = new Date(op.date);
    const startDate = getSomeDaysAgoDate(activityRange);
    return operationDate.getTime() >= startDate.getTime();
  });
  const prevOperations = operations.filter((op) => {
    const startDate = getSomeDaysAgoDate(activityRange * 2);
    const endDate = getSomeDaysAgoDate(activityRange);
    const operationDate = new Date(op.date);

    return operationDate.getTime() >= startDate.getTime() && operationDate.getTime() < endDate.getTime();
  });

  function handleChange({ target }: React.ChangeEvent<HTMLSelectElement>): void {
    setActivityRange(parseInt(target.value, 10));
  }

  const selectStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0)',
    border: 'none',
    borderRadius: '8px',
    appearance: 'none',
    padding: '.5rem',
    fontWeight: 600,
  };
  const header = (
    <h4 className="">
      Ваши финансы за последние{' '}
      <select className="activity-board__select" onChange={handleChange} style={selectStyles} value={activityRange}>
        <option value={30}>30</option>
        <option value={60}>60</option>
        <option value={90}>90</option>
        <option value={180}>180</option>
        <option value={365}>365</option>
      </select>{' '}
      дней
    </h4>
  );

  const containerStyles: React.CSSProperties = {
    // display: 'grid',
    // gridAutoFlow: 'column',
    // gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
    // gap: '1rem',
    // alignItems: 'center',
    // height: '100%',
  };

  return (
    <ContentBoard header={header}>
      <div className="activity-board__widgets-container" style={containerStyles}>
        <WidgetIncomeOutcome operations={relevantOperations} prevOperations={prevOperations} />
        <WidgetBalanceFlow dateRange={activityRange} operations={relevantOperations} />
        <WidgetBiggestOperations operations={relevantOperations} />
        <WidgetBiggestCategories operations={relevantOperations} />
      </div>
    </ContentBoard>
  );
}

