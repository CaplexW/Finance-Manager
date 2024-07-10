export default function closeModalWindow(window: HTMLDialogElement) {
  window.setAttribute('closing', '');
  window.addEventListener(
    'animationend',
    () => {
      window.removeAttribute('closing');
      window.close();
    },
    { once: true },
  );
}
