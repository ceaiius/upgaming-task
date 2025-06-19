import { useCommentStore } from '../../store/comment';

function countAllComments(comments: any[]): number {
  if (!comments) return 0;
  return comments.reduce(
    (acc, c) => acc + 1 + countAllComments(c.Comments),
    0
  );
}

export function useCommentsTotal(postId: number, totalComments: number) {
  const comments = useCommentStore(s => s.byPost[postId]);
  const storeCount = comments ? countAllComments(comments) : undefined;
  const count = typeof storeCount === 'number' ? storeCount : totalComments;
  return count;
} 