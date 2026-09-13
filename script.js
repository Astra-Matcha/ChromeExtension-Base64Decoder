document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('input');
  const outputArea = document.getElementById('output');
  const convertBtn = document.getElementById('convertBtn');

  convertBtn.addEventListener('click', () => {
    const inputText = inputArea.value.trim();

    if (!inputText) {
      outputArea.value = '';
      return;
    }

    try {
      // Decode Base64 string (handles standard UTF-8 text safely)
      const decodedText = decodeURIComponent(
        escape(atob(inputText))
      );
      outputArea.value = decodedText;
    } catch (e) {
      outputArea.value = 'ERROR';
    }
  });
});
