import showElement from "../console/showElement.ts";
import closeModalWindow from "./closeModalWindow.ts";

export default function openModalById(modalId: string) {
  const modal: HTMLDialogElement | null = document.querySelector(`#${modalId}`);
  showElement(modal, 'modal');
  if (modal) {
    // const table = document.querySelector('#operations-table-container');
    // table?.setAttribute('hidden', 'true');
    modal.showModal();
    document.addEventListener('click', (event) => {
      if (event.target instanceof Element) {
        const { target } = event;
        if (target.nodeName === 'DIALOG') {
          closeModalWindow(modal);
        }
      }
    });
  }
}