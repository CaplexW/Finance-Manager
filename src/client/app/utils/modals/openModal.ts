export default function openModal(modal: HTMLDialogElement) {
  if (!modal) return;

  modal.showModal();
  // document.addEventListener('click', closeModalOnBackdropClick);

  // function closeModalOnBackdropClick(event: Event) {
  //   if (event.target instanceof Element) {
  //     const { target } = event;
  //     if (target.nodeName === 'DIALOG') {
  //       closeModalWindow(modal);
  //     }
  //   }
  // }
}