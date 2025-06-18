import styles from './Avatar.module.scss';
import { useInitialsAvatar } from '../../features/Comment/useInitialsAvatar';

interface Props {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  alt?: string;
}

const Avatar = ({ src, firstName, lastName, alt }: Props) => {
  const initials = useInitialsAvatar(firstName, lastName);
  
  if (src) {
    return <img src={src} alt={alt || initials} className={styles.avatar} />;
  }
  return (
    <div className={styles.avatar}>
      {initials}
    </div>
  );
};

export default Avatar; 