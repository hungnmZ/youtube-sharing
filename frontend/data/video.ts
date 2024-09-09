'use server';

import { revalidatePath } from 'next/cache';

import { ENV_CONFIG } from '@/constants/config';
import { postRequest } from '@/utils/request';

export const shareVideo = async (url: string) => {
  const shareUrl = `${ENV_CONFIG.BACKEND_URL}/api/v1/resource/share`;
  const data = await postRequest(shareUrl, { url });

  revalidatePath('/home');

  return data;
};

export const getVideos = async ({ skip = 0, limit = 10 }) => {
  const shareUrl = `${ENV_CONFIG.BACKEND_URL}/api/v1/resource/paginate`;
  const response = await postRequest(shareUrl, { skip, limit });

  return response;
};
