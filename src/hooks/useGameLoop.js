import { useEffect, useRef } from 'react';

export function useGameLoop(callback) {
  const frameId = useRef();
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const loop = () => {
      savedCallback.current?.();
      frameId.current = requestAnimationFrame(loop);
    };

    frameId.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId.current);
  }, []);
}
