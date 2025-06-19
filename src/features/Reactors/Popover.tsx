import { type ReactNode, useRef, useEffect, useState, useCallback } from 'react';
import styles from './Popover.module.scss';

interface Props {
  children: ReactNode;
  content: ReactNode;
  onOpen?: () => void;
  delay?: number; 
}

const Popover = ({ children, content, onOpen, delay = 200 }: Props) => {
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

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {open && <div className={styles.popover}>{content}</div>}
    </div>
  );
}
export default Popover;
