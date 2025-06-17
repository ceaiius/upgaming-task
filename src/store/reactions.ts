import { create } from 'zustand';
import { type ReactionType, getReactionTypes } from '../services/reactionService';

interface ReactionStore {
  reactionTypes: ReactionType[];
  fetchReactionTypes: () => Promise<void>;
}

export const useReactionStore = create<ReactionStore>((set) => ({
  reactionTypes: [],
  fetchReactionTypes: async () => {
    const types = await getReactionTypes();
    set({ reactionTypes: types });
  },
}));
