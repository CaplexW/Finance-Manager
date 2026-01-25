import React, { cloneElement, useCallback, useEffect, useRef, ReactElement, ReactNode } from 'react';
import { mainColor } from '../../constants/colors';
import closeModalWindow from '../../utils/modals/closeModalWindow';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../utils/console/showElement';
import openModal from '../../utils/modals/openModal';

interface ModalWindowProps {
  headTitle?: string;
  children?: ReactElement | null;
  text?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalWindow({
  headTitle = 'Введите данные',
  children = null,
  text = null,
  isOpen,
  onClose,
}: ModalWindowProps) {
  // TODO придумать как перенести механизм откытия в сам компонент

  const modal = useRef<HTMLDialogElement>(null);

  useEffect(toggleModal, [isOpen]);

  function toggleModal() {
    if(!modal.current) return;

    if(isOpen) handleOpen();
    if(!isOpen) handleClose();
  }

  function handleOpen() { if(modal.current) openModal(modal.current); }
  const handleClose = useCallback(() => { 
    if (modal.current) {
      closeModalWindow(modal.current, onClose);
    }
  }, [onClose]);

  if(isOpen) return <dialog className="dialog" ref={modal}>
      <div className="dialog-content" id="dialogContent">
        <div className="container modal-header">
          <h4 className=''>{headTitle}</h4>
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
          {children ? cloneElement(children, { parent: modal, onClose: handleClose } as any) : text}
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
    </dialog>;
  return null;
}




