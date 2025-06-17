import React, { useState } from 'react';
import styles from './CreatePost.module.scss';
import uploadIcon from '../../assets/thumbnail.svg'
import removeIcon from '../../assets/remove.svg'
import { createPost } from '../../services/postService';
import type { Post } from '../../types/post';

interface Props {
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePostModal = ({ onClose, onPostCreated }: Props) => {
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

  const fileToBase64 = (file: File): Promise<any> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({
          FileName: file.name,
          FileType: file.type,
          FileData: base64,
          FileSize: file.size,
        });
      };
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async () => {
    if (!content && !file) return;

    setLoading(true);

    let filesJson = null;
    if (file) {
      const base64File = await fileToBase64(file);
      filesJson = JSON.stringify([base64File]);
    }

    try {
      const res = await createPost({ content, file: file ?? undefined });
      onPostCreated(res.data);
      setContent('');
      handleRemoveImage();
      onClose(); // Close modal
    } catch (error) {
      console.error('Post creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
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
};

export default CreatePostModal;
