import type { ReactionType } from "../services/reactionService";

export interface PostFile {
  PostFileID: number;
  FileName: string;
  FileType: string;
  FileUrl: string;
}
  
export interface Post {
  PostID: number;
  Content?: string;
  AuthorID: number;
  AuthorFirstName: string;
  AuthorLastName: string;
  AuthorAvatarUrl?: string;
  TotalReactions: number;
  TotalComments: number;
  LastReactorUserID?: number;
  LastReactionAuthor?: string;
  UserReaction?: ReactionType;
  CreateTime: string;
  PostFiles: PostFile[];
  Reactions: {
    LIKE: number;
    LOVE: number;
    LAUGH: number;
    WOW: number;
    SAD: number;
    ANGRY: number;
  };
}
  