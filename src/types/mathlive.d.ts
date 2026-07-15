import React from 'react';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        onInput?: (e: any) => void;
        value?: string;
      }, HTMLElement>;
    }
  }
}
