document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('input');
  const outputArea = document.getElementById('output');
  const convertBtn = document.getElementById('convertBtn');

  function decodeBase64(str) {
    let cleanStr = str.trim()
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    while (cleanStr.length % 4 !== 0) {
      cleanStr += '=';
    }

    const binaryString = atob(cleanStr);
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    const decoder = new TextDecoder('utf-8', { fatal: true });
    
    return decoder.decode(bytes);
  }

  function handleDecode() {
    const rawInput = inputArea.value;

    if (!rawInput.trim()) {
      outputArea.value = '';
      return;
    }

    try {
      const result = decodeBase64(rawInput);
      outputArea.value = result;
    } catch (error) {
      outputArea.value = 'ERROR';
    }
  }

  // Click event
  convertBtn.addEventListener('click', handleDecode);

  // Shortcut: Ctrl+Enter or Cmd+Enter
  inputArea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleDecode();
    }
  });
});
