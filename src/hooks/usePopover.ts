import { useRef, useState, useCallback, useEffect } from 'react';

export function usePopover(onOpen?: () => void, delay: number = 200) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
      if (!hasOpenedRef.current && onOpen) {
        onOpen();
        hasOpenedRef.current = true;
      }
    }, delay);
  }, [onOpen, delay]);

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        handleLeave();
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleLeave]);

  return {
    open,
    wrapperRef,
    handleEnter,
    handleLeave,
  };
} 