import closeModalWindow from './closeModalWindow';

export default function switchModals(window1, window2) {
  closeModalWindow(window1);
  window2.showModal();
}
