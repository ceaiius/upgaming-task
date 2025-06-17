import api from '../api/axios';
import type { Post } from '../types/post';

interface Base64FileDto {
  FileName: string;
  FileType: string;
  FileData: string;
  FileSize: number;
}

interface CreatePostPayload {
  content?: string;
  file?: File;
}

export const fetchAllPosts = async (): Promise<Post[]> => {
  const res = await api.post<Post[]>('/Post/GetAll', {});
  console.log(res.data);
  return res.data;
};

export const createPost = async ({ content, file }: CreatePostPayload) => {
  let filesJson = null;

  if (file) {
    const base64 = await fileToBase64(file);
    filesJson = JSON.stringify([base64]);
  }

  return api.post('/Post/Create', {
    Content: content || null,
    FilesJson: filesJson || null,
  });
};

export const deletePost = async (postId: number) => {
  return api.post(`/Post/Delete`, {
    PostID: postId,
  });
};

const fileToBase64 = (file: File): Promise<Base64FileDto> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        FileName: file.name,
        FileType: file.type,
        FileData: base64,
        FileSize: file.size,
      });
    };
    reader.onerror = reject;
  });
