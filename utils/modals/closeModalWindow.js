import showElement from './debug/showElement';

export default function closeModalWindow(window) {
  showElement(window, 'window');
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
