export default function showErrorMessage(window) {
  window.removeAttribute('hidden');
  setTimeout(() => {
    window.setAttribute('hidden', '');
  }, 5000);
}
