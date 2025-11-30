import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../server/utils/console/showElement';
import operationsService from '../services/operations.service';
import ActivityBoard from '../components/UI/activityBoard';
import SizeTestComponent from '../components/common/test/sizeTestComponent';

export default function MainPage() {
  function showInfo() {
    const input = document.querySelector('#inputFilie');
    const inputObj = { ...input };
  }
  async function prepareData() {
    const input = document.querySelector('#inputFilie') as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const result = await operationsService.uploadCSV(formData, 'tinkoff');
  }
  return (
    <div className="main-page">
      <ActivityBoard />
      <SizeTestComponent />
    </div>
  );
}






