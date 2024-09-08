import { ENV_CONFIG } from '@/constants/config';
import { shareVideo } from '@/data/share';
import { postRequest } from '@/utils/request';

jest.mock('@/utils/request');
jest.mock('@/constants/config', () => ({
  ENV_CONFIG: {
    BACKEND_URL: 'https://api.example.com',
  },
}));

describe('shareVideo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call postRequest with correct URL and body', async () => {
    const mockResponse = { status: 200, success: true };
    (postRequest as jest.Mock).mockResolvedValue(mockResponse);

    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const result = await shareVideo(url);

    expect(postRequest).toHaveBeenCalledWith(
      `${ENV_CONFIG.BACKEND_URL}/api/v1/resource/share`,
      { url },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors from postRequest', async () => {
    const mockError = new Error('Network error');
    (postRequest as jest.Mock).mockRejectedValue(mockError);

    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    await expect(shareVideo(url)).rejects.toThrow('Network error');
  });

  it('should handle non-200 status responses', async () => {
    const mockResponse = { status: 400, message: 'Bad Request' };
    (postRequest as jest.Mock).mockResolvedValue(mockResponse);

    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const result = await shareVideo(url);

    expect(result).toEqual(mockResponse);
  });
});
