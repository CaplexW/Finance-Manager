export default function flashInvalidInputs(...inputs) {
  inputs.forEach((input) => {
    if (!input.value) {
      input.classList.add('invalid');
      setTimeout(() => input.classList.remove('invalid'), 3000);
    }
  });
}
