// Create a floating tooltip element
const tooltip = document.createElement('div');
tooltip.style.position = 'fixed';
tooltip.style.zIndex = '999999';
tooltip.style.background = '#1e1e1e';
tooltip.style.color = '#4ec9b0';
tooltip.style.padding = '6px 10px';
tooltip.style.borderRadius = '4px';
tooltip.style.fontSize = '12px';
tooltip.style.fontFamily = 'monospace';
tooltip.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
tooltip.style.display = 'none';
tooltip.style.pointerEvents = 'none';
document.body.appendChild(tooltip);

// Base64 validation regex
const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

document.addEventListener('mouseover', (e) => {
  const text = e.target.innerText ? e.target.innerText.trim() : '';
  
  // Check if text looks like a valid Base64 string (minimum length 8, multiple of 4)
  if (text.length >= 8 && text.length % 4 === 0 && base64Regex.test(text)) {
    try {
      const decoded = decodeBase64(text);
      tooltip.textContent = `Decoded: ${decoded}`;
      tooltip.style.left = `${e.clientX + 12}px`;
      tooltip.style.top = `${e.clientY + 12}px`;
      tooltip.style.display = 'block';
    } catch (err) {
      tooltip.style.display = 'none';
    }
  } else {
    tooltip.style.display = 'none';
  }
});

document.addEventListener('mouseout', () => {
  tooltip.style.display = 'none';
});

function decodeBase64(base64Str) {
  return decodeURIComponent(
    atob(base64Str)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}
