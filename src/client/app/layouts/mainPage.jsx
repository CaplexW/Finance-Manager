import React from 'react';
import showElement from '../../../utils/console/showElement';
import operationsService from '../services/operations.service';

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
    <div className="main">
      <input id="inputFilie" onClick={showInfo} type="file" />
      <button onClick={showInfo} type='button'>Показать инпут</button>
      <button onClick={prepareData} type='button'>Сформировать</button>
    </div>
  );
};
