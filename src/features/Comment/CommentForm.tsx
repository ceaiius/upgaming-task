import styles from './CommentForm.module.scss';

import { useCommentForm } from '../../hooks/Comment/useCommentForm';

interface Props {
  postId: number;
  parentId: number | null;
  onSubmit?: () => void;
}

const CommentForm = ({ postId, parentId, onSubmit }: Props) => {
  const {
    text,
    sending,
    inputRef,
    handleInput,
    handlePaste,
    handleKeyDown,
    submit,
  } = useCommentForm(postId, parentId, onSubmit);


  return (
    <div className={styles.form}>
      <div className={styles.inputWrapper}>
        <div
          className={styles.editable}
          contentEditable={!sending}
          ref={inputRef}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          data-placeholder={parentId ? 'Write a reply…' : 'Write your comment'}
          role="textbox"
          aria-multiline="true"
          tabIndex={0}
          suppressContentEditableWarning
        />
        <button
          className={styles.submitBtn}
          onClick={submit}
          disabled={sending || !text.trim()}
          type="button"
        >
          Comment
        </button>
      </div>
    </div>
  );
};

export default CommentForm;
