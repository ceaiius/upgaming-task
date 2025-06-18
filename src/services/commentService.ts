import api from '../api/axios';
import { type ReactionType } from './reactionService';
import type { Comment } from '../types/comment';


export const fetchComments = (postId: number) =>
  api.post<Comment[]>('/Comment/GetAll', { PostID: postId }).then(r => r.data);

export const createComment = (postId: number, content: string) =>
  api.post<Comment>('/Comment/Create', { PostID: postId, Content: content });

export const createReply = (commentId: number, content: string) =>
  api.post<Comment>('/Comment/ReplyCreate', { CommentID: commentId, Content: content });

export const toggleCommentReact = (id: number, type?: ReactionType) =>
  api.post('/Comment/ReactionToggle', { CommentID: id, ReactionType: type });

export const deleteComment = (id: number) =>
  api.post('/Comment/Delete', { CommentID: id });
