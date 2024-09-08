'use server';

import { ENV_CONFIG } from '@/constants/config';
import { postRequest } from '@/utils/request';

export const shareVideo = async (url: string) => {
  const shareUrl = `${ENV_CONFIG.BACKEND_URL}/api/v1/resource/share`;
  const data = await postRequest(shareUrl, { url });
  return data;
};
