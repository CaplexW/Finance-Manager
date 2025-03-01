import React, { useEffect, useRef, useState } from 'react';
import showElement from '../../../../../server/utils/console/showElement';

export default function SizeTestComponent() {
  const container = useRef();
  const inline = useRef();

  const [fontSize, setFontSize] = useState(1);

  useEffect(updateFontSize, [container, inline]);

  function updateFontSize() {
    if (inline.current) setFontSize(((container.current.offsetWidth / 16) * 1.8) / inline.current.textContent.length);
  }


  const inlineText = '3523423423';

  const testContainerStyles = {
    border: 'solid 1px red',
    // padding: '1rem 2rem',
    maxWidth: '8rem',
  };

  const testInlineStyles = {
    fontSize: `${fontSize}rem`,
    maxWidth: '100%',
  };

  return (
    <div className="test-container" ref={container} style={testContainerStyles}>
      <span className="test-inline-element" ref={inline} style={testInlineStyles}>{inlineText}</span>
    </div>
  );
}
