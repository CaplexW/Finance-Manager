import React, {
  useEffect, useRef, useState,
} from 'react';
import ButtonWithIcon from '../buttonWithIcon';
import showError from '../../../utils/console/showError';
import displayError from '../../../utils/errors/onClient/displayError';
import { arrowLeftIcon, arrowRightIcon } from '../../../../assets/icons';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../utils/console/showElement';
import { Icon } from '../../../../types/types';

interface IconPickerProps {
  value?: Icon;
  onChange: (result: { value: Icon; name: string }) => void;
  name: string;
  label?: string;
  options: Icon[];
  pageSize?: number;
}

export default function IconPicker({
  value,
  onChange,
  name,
  label,
  options,
  pageSize = 10,
}: IconPickerProps): JSX.Element | null {
  const [selectedOption, setSelectedOption] = useState<Icon | undefined>(value);
  const [selectedPage, setSelectedPage] = useState(1);

  const openedPicker = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!value) {
      setInitialValue();
    } else if (value && value._id !== selectedOption?._id) {
      setSelectedOption(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const firstPage = selectedPage === 1;
  const lastPage = selectedPage >= Math.ceil(options.length / pageSize);
  const onlyPage = firstPage && lastPage;

  const displayedIcons = options.filter((_, index) => index >= pageSize * selectedPage - pageSize && index <= pageSize * selectedPage - 1);

  const leftCurret = arrowLeftIcon || '<';
  const rightCurret = arrowRightIcon || '>';

  const containerSyles: React.CSSProperties = { maxWidth: '300px', width: 'fit-content' };
  const pickerStyles: React.CSSProperties = { borderRadius: '8px', padding: '.1em' };
  const closedPickerStyles: React.CSSProperties = { background: 'rgba(255, 255, 255, 0.5)' };
  const openPickerStyles: React.CSSProperties = {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.9)',
    bottom: '180px',
    left: '95px',
    paddingInline: '1rem',
    paddingBlockStart: '.6rem',
    marginRight: '1rem',
    zIndex: 100,
  };
  const pickerPageStyles: React.CSSProperties = { display: 'flex', flexWrap: 'wrap' };
  const paginatorStyles: React.CSSProperties = { display: 'flex', marginBlock: '1rem .7rem', justifyContent: 'space-between' };

  function handleChoice(icon: Icon | undefined): void {
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

  function setInitialValue(): void {
    if (!options.length) return;
    onChange({ value: options[0], name });
    setSelectedOption(options[0]);
  }
  function toggleIconPage(): void {
    if (!openedPicker.current) return;
    if (openedPicker.current.hasAttribute('hidden')) {
      openedPicker.current.removeAttribute('hidden');
    } else {
      openedPicker.current.setAttribute('hidden', 'true');
    }
  }
  function closeIconPage(): void {
    if (openedPicker.current) openedPicker.current.setAttribute('hidden', 'true');
  }
  function turnPrevPage(): void {
    if (selectedPage > 1) setSelectedPage((prevState) => prevState - 1);
  }
  function turnNextPage(): void {
    if (selectedPage < Math.ceil(options.length / pageSize)) setSelectedPage((prevState) => prevState + 1);
  }

  if (!selectedOption) return null;

  return (
    <div>
      <label htmlFor="icon-picker">{label}</label>
      <div className="picker-container" style={containerSyles}>
        <div className="picker--closed button" style={{ ...pickerStyles, ...closedPickerStyles }}>
          <ButtonWithIcon color="black" icon={selectedOption} onClick={toggleIconPage} size={1.5} />
        </div>
        <div className="picker--open" hidden ref={openedPicker} style={{ ...pickerStyles, ...openPickerStyles }}>
          <div className="picker__page" style={pickerPageStyles}>
            {displayedIcons.map((option) => (
              <ButtonWithIcon icon={option} key={option._id} onClick={handleChoice} size={1.5} />
            ))}
          </div>
          <div className="picker__paginator" style={paginatorStyles}>
            {onlyPage
              || (
                <>
                  <button disabled={firstPage} onClick={turnPrevPage} type="button">
                    {leftCurret}
                  </button>
                  <button disabled={lastPage} onClick={turnNextPage} type="button">
                    {rightCurret}
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

