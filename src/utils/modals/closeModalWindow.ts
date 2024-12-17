export default function closeModalWindow(window: HTMLDialogElement, finishClosing: Function = null) {
  window.setAttribute('closing', '');
  window.addEventListener(
    'animationend',
    () => {
      window.removeAttribute('closing');
      window.close();
      if (finishClosing) finishClosing(); // Эта функция меняет стейт модального окна по окончанию анимации.
    },
    { once: true },
  );
}
