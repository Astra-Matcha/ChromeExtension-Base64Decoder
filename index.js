// Create a floating trigger button
const triggerBtn = document.createElement('button');
triggerBtn.textContent = 'Scan Base64';
triggerBtn.style.position = 'fixed';
triggerBtn.style.bottom = '20px';
triggerBtn.style.right = '20px';
triggerBtn.style.zIndex = '999999';
triggerBtn.style.padding = '10px 14px';
triggerBtn.style.background = '#007acc';
triggerBtn.style.color = '#fff';
triggerBtn.style.border = 'none';
triggerBtn.style.borderRadius = '4px';
triggerBtn.style.cursor = 'pointer';
triggerBtn.style.fontFamily = 'sans-serif';
triggerBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
document.body.appendChild(triggerBtn);

// Create a results panel
const panel = document.createElement('div');
panel.style.position = 'fixed';
panel.style.bottom = '70px';
panel.style.right = '20px';
panel.style.width = '350px';
panel.style.maxHeight = '400px';
panel.style.overflowY = 'auto';
panel.style.background = '#1e1e1e';
panel.style.color = '#d4d4d4';
panel.style.padding = '12px';
panel.style.borderRadius = '6px';
panel.style.zIndex = '999999';
panel.style.fontFamily = 'monospace';
panel.style.fontSize = '12px';
panel.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
panel.style.display = 'none';
document.body.appendChild(panel);

const base64Regex = /\b[A-Za-z0-9+/]{8,}(?:==|=)?\b/g;

triggerBtn.addEventListener('click', () => {
  if (panel.style.display === 'block') {
    panel.style.display = 'none';
    return;
  }

  const results = scanPage();
  renderResults(results);
  panel.style.display = 'block';
});

function scanPage() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const found = new Set();

  let node;
  while ((node = walker.nextNode())) {
    // Skip script/style tags content
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.tagName)) continue;

    const text = node.textContent;
    let match;
    base64Regex.lastIndex = 0;

    while ((match = base64Regex.exec(text)) !== null) {
      const candidate = match[0];
      if (candidate.length % 4 === 0) {
        try {
          const decoded = decodeBase64(candidate);
          // Optional heuristic: filter out non-printable or overly strange strings if needed
          found.add(JSON.stringify({ encoded: candidate, decoded: decoded }));
        } catch (err) {
          // Invalid base64
        }
      }
    }
  }

  return Array.from(found).map(item => JSON.parse(item));
}

function renderResults(results) {
  panel.innerHTML = '';
  
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.marginBottom = '10px';
  header.style.fontWeight = 'bold';
  header.innerHTML = `<span>Found (${results.length})</span>`;
  
  const closeBtn = document.createElement('span');
  closeBtn.textContent = '×';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '16px';
  closeBtn.onclick = () => panel.style.display = 'none';
  header.appendChild(closeBtn);
  panel.appendChild(header);

  if (results.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.textContent = 'No Base64 strings found.';
    emptyMsg.style.color = '#858585';
    panel.appendChild(emptyMsg);
    return;
  }

  results.forEach((item, index) => {
    const itemContainer = document.createElement('div');
    itemContainer.style.marginBottom = '8px';
    itemContainer.style.padding = '6px';
    itemContainer.style.background = '#2d2d2d';
    itemContainer.style.borderRadius = '4px';

    const enc = document.createElement('div');
    enc.style.color = '#4ec9b0';
    enc.style.wordBreak = 'break-all';
    enc.textContent = `[${index + 1}] Enc: ${item.encoded}`;

    const dec = document.createElement('div');
    dec.style.color = '#ce9178';
    dec.style.wordBreak = 'break-all';
    dec.style.marginTop = '2px';
    dec.textContent = `Dec: ${item.decoded}`;

    itemContainer.appendChild(enc);
    itemContainer.appendChild(dec);
    panel.appendChild(itemContainer);
  });
}

function decodeBase64(base64Str) {
  return decodeURIComponent(
    atob(base64Str)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}
