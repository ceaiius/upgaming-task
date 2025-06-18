import React, { useState, forwardRef } from 'react';
import styles from './CreatePost.module.scss';
import uploadIcon from '../../assets/thumbnail.svg'
import removeIcon from '../../assets/remove.svg'
import { createPost } from '../../services/postService';
import type { Post } from '../../types/post';

interface Props {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePostModal = forwardRef<HTMLDivElement, Props>(({ onClose, onPostCreated }, ref) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isDisabled = !content.trim() && !file;
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };



  const handleSubmit = async () => {
    if (!content && !file) return;

    setLoading(true);

    try {
      const res = await createPost({ content, file: file ?? undefined });
      onPostCreated(res.data);
      setContent('');
      handleRemoveImage();
      onClose();
    } catch (error) {
      console.error('Post creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} ref={ref}>
        <div className={styles.modalHeader}>
          <h3>Create Post</h3>
          <a onClick={onClose} className={styles.closeBtn}>✕</a>
        </div>

        <textarea
          placeholder="What would you like to talk about today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
        />

        

        <div className={styles.actions}>
          <label className={styles.uploadIcon}>
            <img src={uploadIcon} alt="upload" />
            
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
          {previewUrl && (
            <div className={styles.imagePreview}>
              <div className={styles.previewWrapper}>
                <img src={previewUrl} alt="preview" />
                <button onClick={handleRemoveImage} className={styles.removeBtn}>
                  <img src={removeIcon} alt="close" />
                </button>
              </div>
            </div>
          )}
          <button className={styles.postBtn} onClick={handleSubmit} disabled={isDisabled}>
            {loading ? <div className={styles.spinner} /> : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default CreatePostModal;
