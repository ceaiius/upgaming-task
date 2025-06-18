// features/ReactionSummary/Popover.tsx
import { type ReactNode, useRef, useEffect, useState, useCallback } from 'react';
import styles from './Popover.module.scss';

interface Props {
  children: ReactNode;
  content: ReactNode;
  onOpen?: () => void;
}

const Popover = ({ children, content, onOpen }: Props) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasOpenedRef = useRef(false);

  const handleEnter = useCallback(() => {
    setOpen(true);
    if (!hasOpenedRef.current && onOpen) {
      onOpen();
      hasOpenedRef.current = true;
    }
  }, [onOpen]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && <div className={styles.popover}>{content}</div>}
    </div>
  );
}
export default Popover;
