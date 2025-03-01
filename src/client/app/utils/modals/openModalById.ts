import closeModalWindow from "./closeModalWindow.ts";

export default function openModalById(modalId: string) {
  const modal: HTMLDialogElement | null = document.querySelector(`#${modalId}`);
  if (modal) {
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