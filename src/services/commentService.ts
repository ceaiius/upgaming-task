import api from '../api/axios';
import { type ReactionType } from './reactionService';

export interface Comment {
  CommentID: number;
  ParentCommentID?: number | null;
  PostID: number;
  AuthorID: number;
  AuthorFirstName: string;
  AuthorLastName: string;
  AuthorAvatar?: string | null;
  Content: string;
  IsAuthor: boolean;
  TotalReactions: number;
  TotalReplies: number;
  UserReaction?: ReactionType | null;
  CreateTime: string;
  Reactions: Record<ReactionType, number>;
  Comments: Comment[];
}

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
