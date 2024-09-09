import { revalidatePath } from 'next/cache';

import { ENV_CONFIG } from '@/constants/config';
import { getVideos, shareVideo } from '@/data/video';
import { postRequest } from '@/utils/request';

jest.mock('@/utils/request', () => ({
  postRequest: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Video Data Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shareVideo', () => {
    it('calls postRequest with correct parameters', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const mockResponse = { status: 200, data: 'Success' };
      (postRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await shareVideo(mockUrl);

      expect(postRequest).toHaveBeenCalledWith(
        `${ENV_CONFIG.BACKEND_URL}/api/v1/resource/share`,
        { url: mockUrl },
      );
      expect(result).toEqual(mockResponse);
    });

    it('calls revalidatePath with /home', async () => {
      const mockUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      await shareVideo(mockUrl);

      expect(revalidatePath).toHaveBeenCalledWith('/home');
    });
  });

  describe('getVideos', () => {
    it('calls postRequest with correct parameters and default values', async () => {
      const mockResponse = { status: 200, data: [] };
      (postRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getVideos({});

      expect(postRequest).toHaveBeenCalledWith(
        `${ENV_CONFIG.BACKEND_URL}/api/v1/resource/paginate`,
        { skip: 0, limit: 10 },
      );
      expect(result).toEqual(mockResponse);
    });

    it('calls postRequest with custom skip and limit values', async () => {
      const mockResponse = { status: 200, data: [] };
      (postRequest as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getVideos({ skip: 20, limit: 5 });

      expect(postRequest).toHaveBeenCalledWith(
        `${ENV_CONFIG.BACKEND_URL}/api/v1/resource/paginate`,
        { skip: 20, limit: 5 },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
