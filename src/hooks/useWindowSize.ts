import { useLayoutEffect, useState } from 'react';

type IWindow = {
  width?: number;
  height?: number;
};
/**
React hook to get the current size of the browser window.
@return {IWindow} An object with properties width and height representing the current size of the browser window.
*/
export default function useWindowSize(): IWindow {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<IWindow>({
    width: undefined,
    height: undefined,
  });
  useLayoutEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      const doc = document.documentElement;

      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
      doc.style.setProperty('--app-width', `${window.innerWidth}px`);
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
