export interface Comment {
    CommentID: number
    ParentCommentID: number | null
    PostID: number
    AuthorID: number
    AuthorFirstName: string
    AuthorLastName: string
    AuthorAvatar: string | null
    Content: string
    IsAuthor: boolean
    TotalReactions: number
    TotalReplies: number
    UserReaction: string | null
    CreateTime: string
    Reactions: Record<string, number>
    Comments: Comment[]
  }
  