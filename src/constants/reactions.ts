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
  color: string;
}

export const reactionOptions: ReactionData[] = [
  {
    type: 'LIKE',
    icon: likeIcon,
    label: 'Like',
    color: '#3E93F8',
  },
  {
    type: 'LOVE',
    icon: loveIcon,
    label: 'Love',
    color: '#BC3A76',
  },
  {
    type: 'LAUGH',
    icon: laughIcon,
    label: 'Haha',
    color: '#F9CF00',

  },
  {
    type: 'WOW',
    icon: wowIcon,
    label: 'Wow',
    color: '#F9CF00'
  },
  {
    type: 'SAD',
    icon: sadIcon,
    label: 'Sad',
    color: '#F9CF00'
  },
  {
    type: 'ANGRY',
    icon: angryIcon,
    label: 'Angry',
    color: '#FF5757',

  },
];
