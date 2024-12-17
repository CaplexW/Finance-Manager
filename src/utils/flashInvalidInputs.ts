import showElement from "./console/showElement.ts";

export default function flashInvalidInputs(...inputs: HTMLElement[]) {
  inputs.forEach((input) => {
    if (input.nodeName === 'DIV') {
      input.classList.add('bordered');
    }
      input.classList.add('invalid');
  });
}
