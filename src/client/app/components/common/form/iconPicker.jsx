import React, { useEffect, useRef, useState } from 'react';
import ButtonWithIcon from '../buttonWithIcon';
import showError from '../../../../../utils/console/showError';
import displayError from '../../../../../utils/errors/onClient/displayError';
import { arrowLeftIcon, arrowRightIcon } from '../../../../assets/icons';
import showElement from '../../../../../utils/console/showElement';

export default function IconPicker({
  value,
  onChange,
  name,
  label,
  options,
  pageSize,
}) {
  showElement(value, 'value');
  const [selectedOption, setSelectedOption] = useState(value);
  const [selectedPage, setSelectedPage] = useState(1);

  const openedPicker = useRef();

  useEffect(() => {
    if (!value) {
      setInitialValue();
    } else {
      // if(value._id !== selectedOption._id) setSelectedOption(value);
    };
   }, [selectedOption]);

  //TODO value нету пока не ткунть по иконке. Задать initialValue при рендере компонента.

  const firstPage = selectedPage === 1;
  const lastPage = selectedPage >= Math.floor(options.length / pageSize);
  const onlyPage = firstPage && lastPage;

  const displayedIcons = options.filter((_, index) => index >= pageSize * selectedPage - pageSize && index <= pageSize * selectedPage);

  const leftCurret = arrowLeftIcon || '<';
  const rightCurret = arrowRightIcon || '>';

  const containerSyles = { maxWidth: '300px', width: 'fit-content' };
  const pickerStyles = { borderRadius: '8px', padding: '.1em' };
  const closedPickerStyles = { background: 'rgba(255, 255, 255, 0.5)' };
  const openPickerStyles = {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.9)',
    bottom: '180px',
    left: '95px',
    paddingInline: '1rem',
    paddingBlockStart: '.6rem',
    marginRight: '1rem',
    zIndex: '100',
  };
  const pickerPageStyles = { display: 'flex', flexWrap: 'wrap' };
  const paginatorStyles = { display: 'flex', marginBlock: '1rem .7rem', justifyContent: 'space-between' };

  function handleChoice(icon) {
    if (!icon) {
      showError('No value on iconPicker in choice handler!');
      displayError('Произошла ошибка, попробуйте позже');
      closeIconPage();
      return;
    }

    setSelectedOption(icon);
    onChange({ value: icon, name });
    closeIconPage();
  }

  function setInitialValue() {
    onChange({ value: options[0], name });
    setSelectedOption(options[0]);
  }
  function toggleIconPage() {
    if (openedPicker.current.hasAttribute('hidden')) {
      openedPicker.current.removeAttribute('hidden');
    } else {
      openedPicker.current.setAttribute('hidden', true);
    }
  }
  function closeIconPage() {
    if(openedPicker.current) openedPicker.current.setAttribute('hidden', true);
  }
  function turnPrevPage() {
    if (selectedPage > 1) setSelectedPage((prevState) => prevState - 1);
  }
  function turnNextPage() {
    if (selectedPage < Math.floor(options.length / pageSize)) setSelectedPage((prevState) => prevState + 1);
  }

  if (selectedOption) return (
    <div>
      <label htmlFor="icon-picker">{label}</label>
      <div className="picker-container" style={containerSyles} >
        <div className="picker--closed button" style={{ ...pickerStyles, ...closedPickerStyles }} ><ButtonWithIcon icon={selectedOption} onClick={toggleIconPage} /></div>
        <div className="picker--open" hidden ref={openedPicker} style={{ ...pickerStyles, ...openPickerStyles }}>
          <div className="picker__page" style={pickerPageStyles} >
            {displayedIcons.map((option) => <ButtonWithIcon icon={option} key={option._id} onClick={handleChoice} size={24} />)}
          </div>
          <div className="picker__paginator" style={paginatorStyles}>
            {onlyPage ||
            <>
              <button disabled={firstPage} onClick={turnPrevPage} type='button'>{leftCurret}</button>
              <button disabled={lastPage} onClick={turnNextPage} type='button'>{rightCurret}</button>
            </>}
          </div>
        </div>
      </div>
    </div >
  );
};
