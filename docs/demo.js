function showExample(input) {
  document.querySelector('.edit-input').value = input;
  updatePreview(AsciiLayout(input, true));
}

function updatePreview(text) {
  document.querySelector('.preview-input').value = text;
}

function copy() {
  document.querySelector('.preview-input').select();
  document.execCommand('copy');
  document.querySelector('.preview-input').blur();
}
