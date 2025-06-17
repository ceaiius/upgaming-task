import api from '../api/axios';

export interface User {
  UserID: number;
  FirstName: string;
  LastName: string;
  AvatarUrl?: string;
}

export const fetchUser = async (): Promise<User> => {
  const res = await api.post<User>('/User/Get', {});
  return res.data;
};
