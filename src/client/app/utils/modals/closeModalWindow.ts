export default function closeModalWindow(window: HTMLDialogElement, finishClosing: () => void = dummyFunc) {
  window.setAttribute('closing', '');
  window.addEventListener(
    'animationend',
    () => {
      window.removeAttribute('closing');
      window.close();
      finishClosing(); // Эта функция меняет стейт модального окна по окончанию анимации.
    },
    { once: true },
  );
}

function dummyFunc() {}