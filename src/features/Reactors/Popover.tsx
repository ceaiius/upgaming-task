import { type ReactNode } from 'react';
import styles from './Popover.module.scss';
import { usePopover } from '../../hooks/usePopover';

interface Props {
  children: ReactNode;
  content: ReactNode;
  onOpen?: () => void;
  delay?: number; 
}

const Popover = ({ children, content, onOpen, delay = 200 }: Props) => {
  const { open, wrapperRef, handleEnter, handleLeave } = usePopover(onOpen, delay);

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
