import React, { useCallback, useRef, useState } from 'react';
import ButtonWithIcon from '../buttonWithIcon';
import showElement from '../../../../../utils/console/showElement';

export default function IconPicker({
  value,
  onChange,
  name,
  label,
  error,
  options,
  pageSize,
}) {
  // 1. Получаем options = { _id, name, src }[]
  // 2. Маппим source -> возвращаем компонент иконки
  // 3. Слушаем клик по иконке
  // 4. По клику возвращаем _id
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [pageRange, setPageRange] = useState({ start: 0, end: pageSize });

  const closedPicker = useRef();
  const openedPicker = useRef();
  // const input = useRef();

  const leftCurret = '<';
  const rightCurret = '>';

  const containerSyles = { maxWidth: '300px', width: 'fit-content' };
  const pickerStyles = { background: 'rgba(255, 255, 255, 0.5)', borderRadius: '8px', padding: '.1em' };
  const openPickerStyles = { position: 'relative' };
  const pickerPageStyles = { display: 'flex', flexWrap: 'wrap' };
  const paginatorStyles = { display: 'flex', margin: '1rem .7rem .7rem .7rem', justifyContent: 'space-between' };

  function handleOpen() {
    closedPicker.current.setAttribute('hidden', true);
    openedPicker.current.removeAttribute('hidden');
  }
  function handleClose() {
    openedPicker.current.setAttribute('hidden', true);
    closedPicker.current.removeAttribute('hidden');
  }
  function handleChoice(icon) {
    setSelectedOption(icon);
    onChange({ value: icon, name });
    // Здесь прилетает undefiend потому что icon на данный момент не полноценный MongoObject а только src.
    // TODO Перевести категории на новый стандарт иконок.
    handleClose();
  }
  function turnPrevPage() {
    if (pageRange.start !== 0) setPageRange((prevState) => ({ start: prevState.start - pageSize, end: prevState.end - pageSize }));
  }
  function turnNextPage() {
    if (pageRange.end < options.length) setPageRange((prevState) => ({ start: prevState.start - pageSize, end: prevState.end - pageSize }));
  }

  return (
    <div>
      <label htmlFor="icon-picker">{label}</label>
      {/* <input hidden id="icon-picker" name={name} ref={input} type="select" value={selectedOption} /> */}
      <div className="picker-container" style={containerSyles} >
        <div className="picker--closed" ref={closedPicker} style={pickerStyles} ><ButtonWithIcon icon={selectedOption} onClick={handleOpen} /></div>
        <div className="picker--open" hidden ref={openedPicker} style={{ ...pickerStyles, ...openPickerStyles }}>
          <div className="picker__page" style={pickerPageStyles} >
            {options.map((option, index) => {
              if (index < pageSize) return <ButtonWithIcon icon={option} key={option._id} onClick={useCallback(() => handleChoice(option))} size={24} />;
            })}
          </div>
          <div className="picker__paginator" style={paginatorStyles} >
            <button onClick={turnPrevPage} type='button'>{leftCurret}</button>
            <button onClick={turnNextPage} type='button'>{rightCurret}</button>
          </div>
        </div>
      </div>
    </div >
  );
};
