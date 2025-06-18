import { create } from 'zustand';
import type { Comment } from '../types/comment';

interface State {
  byPost: Record<number, Comment[]>;
  setComments(post: number, list: Comment[]): void;
  addComment(post: number, c: Comment): void;
  patchComment(post: number, c: Comment): void;
  removeComment(post: number, id: number): void;
  addReply(post: number, parentId: number, reply: Comment): void;
}

export const useCommentStore = create<State>((set) => ({
  byPost: {},

  setComments: (post, list) =>
    set(s => ({ byPost: { ...s.byPost, [post]: list } })),

  addComment: (post, c) =>
    set(s => ({
      byPost: {
        ...s.byPost,
        [post]: [c, ...(s.byPost[post] ?? [])]
      }
    })),

  patchComment: (post, c) =>
    set(s => ({
      byPost: {
        ...s.byPost,
        [post]: (s.byPost[post] ?? []).map(x =>
          x.CommentID === c.CommentID ? c : x
        )
      }
    })),

  removeComment: (post, id) =>
    set(s => ({
      byPost: {
        ...s.byPost,
        [post]: removeFromTree(s.byPost[post] ?? [], id),
      }
    })),

  addReply: (post, parentId, reply) =>
    set(s => ({
      byPost: {
        ...s.byPost,
        [post]: addReplyToTree(s.byPost[post] ?? [], parentId, reply),
      }
    })),
}));

function removeFromTree(comments: Comment[], id: number): Comment[] {
  return comments
    .filter(c => c.CommentID !== id)
    .map(c => ({
      ...c,
      Comments: c.Comments ? removeFromTree(c.Comments, id) : [],
    }));
}

function addReplyToTree(comments: Comment[], parentId: number, reply: Comment): Comment[] {
  return comments.map(c => {
    if (c.CommentID === parentId) {
      return { ...c, Comments: [reply, ...(c.Comments ?? [])] };
    }
    return {
      ...c,
      Comments: c.Comments ? addReplyToTree(c.Comments, parentId, reply) : [],
    };
  });
}
