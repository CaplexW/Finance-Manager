export default function flashInvalidInputs(...inputs: HTMLElement[]) {
  inputs.forEach((input) => {
    if (input.nodeName === 'DIV') {
      input.classList.add('bordered');
      setTimeout(() => input.classList.remove('bordered'), 10000);
    }
      input.classList.add('invalid');
      setTimeout(() => input.classList.remove('invalid'), 10000);
  });
}
