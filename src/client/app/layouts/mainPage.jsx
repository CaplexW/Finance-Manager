import React, { useState } from 'react';
import selectInputWithCreate from '../components/common/form/selectInputWithCreate';
import CreatableSelect from 'react-select/creatable';
import SelectInputWithCreate from '../components/common/form/selectInputWithCreate';

export default function MainPage() {
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

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

  return <SelectInputWithCreate data={defaultOptions} />;
};
