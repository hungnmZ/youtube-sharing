import {
  extractVideoId,
  fetchYoutubeVideoInfo,
} from '@frameworks/webserver/helpers/resource.helper';
import { BaseError } from '@frameworks/webserver/utils/response/error.response';
import { google } from 'googleapis';

jest.mock('googleapis');

describe('Resource Helper', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from a valid YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from a valid YouTube short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from a valid YouTube embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract short video ID from a valid YouTube short video URL', () => {
      const url = 'https://www.youtube.com/shorts/Ei4KP5uVtBg';
      expect(extractVideoId(url)).toBe('Ei4KP5uVtBg');
    });

    it('should return null for an invalid YouTube URL', () => {
      const urls = [
        'https://www.example.com',
        'https://www.youtube.com',
        'https://www.youtube.com/watch?v=',
        'https://www.youtube.com/feed/playlists',
        'https://www.youtube.com/playlist?list=WL',
        'https://www.youtube.com/playlist?list=PLHEH4RHwXsbcMkh0hbGdfXOKricGlkTRy&jct=096XU7r9wUAIG19jyVKxeiclIBskOw',
      ];
      urls.forEach((url) => {
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
