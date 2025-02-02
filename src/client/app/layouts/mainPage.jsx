import React from 'react';
import showElement from '../../../utils/console/showElement';
import operationsService from '../services/operations.service';
import ActivityBoard from '../components/UI/activityBoard';
import SizeTestComponent from '../components/common/test/sizeTestComponent';

export default function MainPage() {
  function showInfo() {
    const input = document.querySelector('#inputFilie');
    const inputObj = { ...input };
  }
  async function prepareData() {
    const input = document.querySelector('#inputFilie');
    const file = input.files[0];

    const formData = new FormData();
    formData.append('file', file);
    const result = await operationsService.uploadCSV(formData, 'tinkoff');
  }

  return (
    <div className="main p-4">
      <ActivityBoard />
      {/* <SizeTestComponent /> */}
    </div>
  );
};
