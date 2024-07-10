import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { nodesPropType } from '../../../../types/propTypes';
import { mainColor } from '../../../../constants/colors';
import closeModalWindow from '../../../../utils/modals/closeModalWindow';

export default function ModalWindow({
  id, headTitle, children, text,
}) {
  function closeWindow() {
    closeModalWindow(document.querySelector(`#${id}`));
  }
  return (
    <dialog className="dialog" id={id}>
      <div className="dialog-content" id="dialogContent">
        <div className="container modal-header">
          <h4 className='me-5'>{headTitle}</h4>
          <button
            aria-label="Close"
            className="close-button"
            id="closeButton"
            onClick={closeWindow}
            type="button"
          >
            &#x2715;
          </button>
        </div>
        <div className="container modal-body" id="modalBody">
          {children ? cloneElement(children, { id }) : text}
        </div>
        {text ? (
          <div className="container modal-buttons" id="modalFooter">
            <button
              className="btn m-1"
              id="okButton"
              key="submitButton"
              onClick={closeWindow}
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
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
};

ModalWindow.defaultProps = {
  children: undefined,
  headTitle: 'Введите данные',
  text: undefined,
};
