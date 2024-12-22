export default function flashOffInvalidInputs(...inputs: HTMLElement[]) {
  inputs.forEach((input) => {
    if (input.nodeName === 'DIV') {
      input.classList.remove('bordered');
    }
      input.classList.remove('invalid');
  });
}
