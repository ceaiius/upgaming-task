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
    color: '#237AB7',
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
    color: '#F5C123',

  },
  {
    type: 'WOW',
    icon: wowIcon,
    label: 'Wow',
    color: '#F5C123'
  },
  {
    type: 'SAD',
    icon: sadIcon,
    label: 'Sad',
    color: '#F5C123'
  },
  {
    type: 'ANGRY',
    icon: angryIcon,
    label: 'Angry',
    color: '#F5C123',

  },
];
