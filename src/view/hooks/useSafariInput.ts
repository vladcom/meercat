import { useEffect, useRef, TouchEvent } from 'react';

function useSafariInput() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = ref.current;
    const onTouchMove = function (event: TouchEvent<HTMLDivElement>) {
      alert('touchmove');
      event.preventDefault();
    };
    const onFocus = function () {
      console.log('FOCUS');
      // alert('FOCUS');
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    };
    console.log('ref: ', ref.current);
    input?.addEventListener('touchmove', onTouchMove as never);
    input?.addEventListener('focus', onFocus);
    return () => {
      input?.removeEventListener('touchmove', onTouchMove as never);
      input?.removeEventListener('focus', onFocus);
    };
  }, []);

  return ref;
}
export default useSafariInput;
