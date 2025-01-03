import React, { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { nodesPropType } from '../../../../types/propTypes';
import { mainColor } from '../../../../constants/colors';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';
import showElement from '../../../../utils/console/showElement';
import openModal from '../../../../utils/modals/openModal';

export default function ModalWindow({
  headTitle, children, text, isOpen, onClose,
}) {
  // TODO придумать как перенести механизм откытия в сам компонент

  // const [isOpen, setOpen] = useState(false);
  const modal = useRef();

  useEffect(toggleModal, [isOpen]);

  function toggleModal() {
    if(!modal.current) return;

    if(isOpen) handleOpen();
    if(!isOpen) handleClose();
  }

  function handleOpen() { if(modal.current) openModal(modal.current); }
  const handleClose = useCallback(() => { 
    closeModalWindow(modal.current, onClose);
  });

  if(isOpen) return (
    <dialog className="dialog" ref={modal}>
      <div className="dialog-content" id="dialogContent">
        <div className="container modal-header">
          <h4 className='me-5'>{headTitle}</h4>
          <button
            aria-label="Close"
            className="close-button"
            id="closeButton"
            onClick={handleClose}
            type="button"
          >
            &#x2715;
          </button>
        </div>
        <div className="container modal-body" id="modalBody">
          {children ? cloneElement(children, { parent: modal, onClose: handleClose }) : text}
        </div>
        {text ? (
          <div className="container modal-buttons" id="modalFooter">
            <button
              className="btn m-1"
              id="okButton"
              key="submitButton"
              onClick={handleClose}
              style={{ backgroundColor: mainColor }}
              type="button"
            >
              Ок
            </button>
          </div>
        ) : ''}
      </div>
    </dialog>
  );
}

ModalWindow.propTypes = {
  children: nodesPropType,
  headTitle: PropTypes.string,
  text: PropTypes.string,
};

ModalWindow.defaultProps = {
  children: undefined,
  headTitle: 'Введите данные',
  text: undefined,
};
