import {
  extractVideoId,
  fetchYoutubeVideoInfo,
} from '@frameworks/webserver/helpers/resource.helper';
import { BaseError } from '@frameworks/webserver/utils/response/error.response';
import { google } from 'googleapis';

jest.mock('googleapis');

describe('Resource Helper', () => {
  describe('extractVideoId', () => {
    const validURLs = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/v/dQw4w9WgXcQ',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share',
    ];

    const invalidURLs = [
      'not a url',
      'https://www.example.com',
      'https://www.youtube.com',
      'https://www.youtube.com/watch?v=',
      'https://www.youtube.com/shorts/',
      'https://www.youtube.com/feed/playlists',
      'https://www.youtube.com/playlist?list=WL',
      'https://www.youtube.com/playlist?list=PLHEH4RHwXsbcMkh0hbGdfXOKricGlkTRy&jct=096XU7r9wUAIG19jyVKxeiclIBskOw',
      'https://youtu.be/ARnftey', // id length < 11
      'https://youtu.be/ARnfsdqweqweqwe', // id length > 11
      'https://www.youtube.com/shorts/ARnftey',
      'https://www.youtube.com/shorts/ARnfsdqweqweqwe',
      'https://www.youtube.com/channel/UCq-Fj5jknLsUf-MWSy4_brA',
      'https://www.youtube.com/c/YouTubeCreators',
      'https://www.youtube.com/user/YouTube',
    ];

    validURLs.forEach((url) => {
      it(`should accept valid YouTube URL: ${url}`, () => {
        expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
      });
    });

    invalidURLs.forEach((url) => {
      it(`should reject invalid YouTube URL: ${url}`, () => {
        expect(extractVideoId(url)).toBeNull();
      });
    });
  });

  describe('fetchYoutubeVideoInfo', () => {
    const mockVideoData = {
      data: {
        items: [
          {
            snippet: {
              title: 'Test Video',
              description: 'Test Description',
              channelTitle: 'Test Channel',
              thumbnails: {
                maxres: {
                  url: 'https://example.com/thumbnail.jpg',
                  width: 1280,
                  height: 720,
                },
              },
            },
            statistics: {
              viewCount: '1000',
              likeCount: '100',
              dislikeCount: '10',
              commentCount: '50',
            },
          },
        ],
      },
    };

    beforeEach(() => {
      (google.youtube as jest.Mock).mockReturnValue({
        videos: {
          list: jest.fn().mockResolvedValue(mockVideoData),
        },
      });
    });

    it('should fetch YouTube video info successfully', async () => {
      const videoId = 'dQw4w9WgXcQ';
      const result = await fetchYoutubeVideoInfo(videoId);

      expect(google.youtube).toHaveBeenCalledWith({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY,
      });

      expect(result).toEqual(mockVideoData.data.items[0]);
    });

    it('should throw Api400Error when fetching video info fails', async () => {
      const videoId = 'invalid_id';
      (google.youtube as jest.Mock).mockReturnValue({
        videos: {
          list: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      });

      await expect(fetchYoutubeVideoInfo(videoId)).rejects.toThrow(BaseError);
      await expect(fetchYoutubeVideoInfo(videoId)).rejects.toThrow(
        'Failed to fetch video information with given url',
      );
    });
  });
});
