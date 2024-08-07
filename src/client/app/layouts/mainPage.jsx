import React from 'react';
import showElement from '../../../utils/console/showElement';
import operationsService from '../services/operations.service';

export default function MainPage() {
  function showInfo() {
    const input = document.querySelector('#inputFilie');
    showElement(input.files, 'input.files');
    const inputObj = { ...input };
    showElement(inputObj, 'inputObj');
  }
  async function prepareData() {
    const input = document.querySelector('#inputFilie');
    const file = input.files[0];
    showElement(file, 'data');

    const formData = new FormData();
    formData.append('file', file);
    showElement(formData.get('file'), 'formedData.get()');
    const result = await operationsService.uploadCSV(formData, 'tinkoff');
    showElement(result, 'result');
  }

  return (
    <div className="main">
      <input id="inputFilie" onClick={showInfo} type="file" />
      <button onClick={showInfo} type='button'>Показать инпут</button>
      <button onClick={prepareData} type='button'>Сформировать</button>
    </div>
  );
};
