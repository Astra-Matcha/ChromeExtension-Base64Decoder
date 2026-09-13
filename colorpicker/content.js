// 1. Hover 시 색상을 보여줄 Tooltip 엘리먼트 생성 및 스타일 설정
const colorTooltip = document.createElement('div');
colorTooltip.id = 'color-code-hover-tooltip';
Object.assign(colorTooltip.style, {
  position: 'fixed',
  width: '20px',
  height: '20px',
  borderRadius: '4px',
  border: '1.5px solid #ffffff',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  pointerEvents: 'none', // 마우스 이벤트를 방해하지 않도록 설정
  zIndex: '999999',
  display: 'none',
  transition: 'transform 0.05s ease-out',
});
document.body.appendChild(colorTooltip);

// 2. HEX 및 RGB/RGBA 정규식 패턴
const colorRegex = /(#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d\.]+\s*)?\))/gi;

// 3. Mouseover 이벤트 핸들러
document.addEventListener('mouseover', (e) => {
  const target = e.target;

  // Tooltip 내부 요소나 스크립트 태그 등 제외
  if (target === colorTooltip || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(target.tagName)) {
    return;
  }

  // 텍스트 노드가 포함된 엘리먼트만 검사
  if (target.childNodes.length > 0) {
    const textContent = target.innerText || target.textContent;
    if (textContent && colorRegex.test(textContent)) {
      const matches = textContent.match(colorRegex);
      if (matches && matches.length > 0) {
        // 가장 먼저 감지된 컬러 코드 적용
        showTooltip(matches[0]);
      }
    }
  }
});

// 4. Mousemove 이벤트: 커서 위치 따라다니기
document.addEventListener('mousemove', (e) => {
  if (colorTooltip.style.display === 'block') {
    // 커서의 오른쪽 상단 약간 위로 위치시킴
    colorTooltip.style.left = `${e.clientX + 12}px`;
    colorTooltip.style.top = `${e.clientY - 24}px`;
  }
});

// 5. Mouseout 이벤트: 커서가 벗어나면 숨김
document.addEventListener('mouseout', (e) => {
  if (!e.relatedTarget || e.relatedTarget.nodeType === Node.DOCUMENT_NODE) {
    hideTooltip();
  } else {
    hideTooltip();
  }
});

// 툴팁 노출 함수
function showTooltip(colorValue) {
  colorTooltip.style.backgroundColor = colorValue;
  colorTooltip.style.display = 'block';
}

// 툴팁 숨김 함수
function hideTooltip() {
  colorTooltip.style.display = 'none';
}
