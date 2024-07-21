import React, { useState } from 'react';
import selectInputWithCreate from '../components/common/form/selectInputWithCreate';
import CreatableSelect from 'react-select/creatable';
import SelectInputWithCreate from '../components/common/form/selectInputWithCreate';
import showElement from '../../../utils/console/showElement';
import operationsService from '../services/operations.service';

export default function MainPage() {
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

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
    const result = await operationsService.upload(formData);
    showElement(result, 'result');
  }
  const defaultOptions = [
    createOption('One'),
    createOption('Two'),
    createOption('Three'),
  ];

  // const [isLoading, setIsLoading] = useState(false);
  // const [options, setOptions] = useState(defaultOptions);
  // const [value, setValue] = useState();

  // function handleCreate(inputValue) {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     const newOption = createOption(inputValue);
  //     setIsLoading(false);
  //     setOptions((prev) => [...prev, newOption]);
  //     setValue(newOption);
  //   }, 1000);
  // };

  return (
    <div className="main">
      <input id="inputFilie" onClick={showInfo} type="file" />
      <button onClick={showInfo} type='button'>Показать инпут</button>
      <button onClick={prepareData} type='button'>Сформировать</button>
    </div>
  );
};
