import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import showElement from '../../../../../server/utils/console/showElement';

export default function SizeTestComponent(): JSX.Element {
  const container = useRef<HTMLDivElement | null>(null);
  const inline = useRef<HTMLSpanElement | null>(null);

  const [fontSize, setFontSize] = useState(1);

  useEffect(() => {
    updateFontSize();
  }, [container, inline]);

  function updateFontSize(): void {
    if (inline.current && container.current) {
      setFontSize(((container.current.offsetWidth / 16) * 1.8) / inline.current.textContent!.length);
    }
  }

  const inlineText = '3523423423';

  const testContainerStyles: React.CSSProperties = {
    border: 'solid 1px red',
    // padding: '1rem 2rem',
    maxWidth: '8rem',
  };

  const testInlineStyles: React.CSSProperties = {
    fontSize: `${fontSize}rem`,
    maxWidth: '100%',
  };

  return (
    <div className="test-container" ref={container} style={testContainerStyles}>
      <span className="test-inline-element" ref={inline} style={testInlineStyles}>
        {inlineText}
      </span>
    </div>
  );
}

