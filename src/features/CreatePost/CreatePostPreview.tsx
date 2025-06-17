import  { useState } from 'react';
import styles from './CreatePost.module.scss';
import CreatePostModal from './CreatePostModal';

const CreatePostPreview = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={styles.previewContainer} onClick={() => setShowModal(true)}>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg" // Use actual avatar
          alt="avatar"
          className={styles.avatar}
        />
        <div className={styles.fakeInput}>Write a post</div>
      </div>

      {showModal && <CreatePostModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default CreatePostPreview;
