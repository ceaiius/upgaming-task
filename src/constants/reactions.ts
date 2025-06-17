import { type ReactionType } from '../services/reactionService'; 
import likeIcon from '../assets/reactions/like.svg';
import loveIcon from '../assets/reactions/love.svg';
import laughIcon from '../assets/reactions/laugh.svg';
import wowIcon from '../assets/reactions/wow.svg';
import sadIcon from '../assets/reactions/sad.svg';
import angryIcon from '../assets/reactions/angry.svg';

export interface ReactionData {
  type: ReactionType;
  icon: string; 
  label: string;
}

export const reactionOptions: ReactionData[] = [
  {
    type: 'LIKE',
    icon: likeIcon,
    label: 'Like',
  },
  {
    type: 'LOVE',
    icon: loveIcon,
    label: 'Love',
  },
  {
    type: 'LAUGH',
    icon: laughIcon,
    label: 'Laugh',
  },
  {
    type: 'WOW',
    icon: wowIcon,
    label: 'Wow',
  },
  {
    type: 'SAD',
    icon: sadIcon,
    label: 'Sad',
  },
  {
    type: 'ANGRY',
    icon: angryIcon,
    label: 'Angry',
  },
];
