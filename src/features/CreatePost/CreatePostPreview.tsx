import  { useState } from 'react';
import styles from './CreatePost.module.scss';
import CreatePostModal from './CreatePostModal';

import { useStore } from '../../store';

const CreatePostPreview = () => {
  const [showModal, setShowModal] = useState(false);
  const user = useStore((state) => state.user);

  return (
    <>
      <div className={styles.previewContainer} onClick={() => setShowModal(true)}>
      {user ? (
        <img
          src={user.AvatarUrl || '/default-avatar.png'}
          alt="avatar"
          className={styles.avatar}
        />
      ) : (
        <div className={styles.avatarSkeleton}></div>
      )}
        <div className={styles.fakeInput}>Write a post</div>
      </div>

      {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
    </>
  );
};


export default CreatePostPreview;
