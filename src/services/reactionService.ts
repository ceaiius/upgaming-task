import api from '../api/axios';

export type ReactionType = 'LIKE' | 'LOVE' | 'LAUGH' | 'WOW' | 'SAD' | 'ANGRY';

export interface Reactor {
    UserID: number;
    FirstName: string;
    LastName: string;
    ReactionType: ReactionType;
    AvatarUrl?: string;
}
export const getReactionTypes = async (): Promise<ReactionType[]> => {
  const res = await api.post('/Post/ReactionTypesGet', {});
  return res.data;
};

export const toggleReaction = async (postId: number, type: ReactionType) => {
  const res = await api.post('/Post/ReactionToggle', {
    PostID: postId,
    ReactionType: type,
  });
  return res.data;
};

export async function getPostReactors(postId: number): Promise<Reactor[]> {
    const res = await api.post('/Post/ReactorGetAll', { PostID: postId });
    return res.data?.Reactors || [];
  }
