jest.mock('googleapis', () => ({
  google: {
    youtube: jest.fn(),
  },
}));

import {
  extractVideoId,
  fetchYoutubeVideoInfo,
  getBestYoutubeThumbnail,
  normalizeYoutubeVideoUrl,
} from '@frameworks/webserver/helpers/resource.helper';
import { BaseError } from '@frameworks/webserver/utils/response/error.response';
import { google } from 'googleapis';

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
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1',
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

  describe('normalizeYoutubeVideoUrl', () => {
    it('should normalize radio playlist URLs to a plain watch URL', () => {
      expect(
        normalizeYoutubeVideoUrl(
          'https://www.youtube.com/watch?v=l1DC_UQzAIw&list=RDl1DC_UQzAIw&start_radio=1',
        ),
      ).toBe('https://www.youtube.com/watch?v=l1DC_UQzAIw');
    });

    it('should return null for invalid YouTube URLs', () => {
      expect(
        normalizeYoutubeVideoUrl('https://www.youtube.com/playlist?list=WL'),
      ).toBeNull();
    });
  });

  describe('getBestYoutubeThumbnail', () => {
    it('should prefer maxres thumbnail when available', () => {
      expect(
        getBestYoutubeThumbnail({
          high: {
            url: 'https://example.com/high.jpg',
            width: 480,
            height: 360,
          },
          maxres: {
            url: 'https://example.com/maxres.jpg',
            width: 1280,
            height: 720,
          },
        }),
      ).toEqual({
        url: 'https://example.com/maxres.jpg',
        width: 1280,
        height: 720,
      });
    });

    it('should fall back to the best available thumbnail when maxres is missing', () => {
      expect(
        getBestYoutubeThumbnail({
          default: {
            url: 'https://example.com/default.jpg',
            width: 120,
            height: 90,
          },
          high: {
            url: 'https://example.com/high.jpg',
            width: 480,
            height: 360,
          },
        }),
      ).toEqual({
        url: 'https://example.com/high.jpg',
        width: 480,
        height: 360,
      });
    });

    it('should return an empty object when no thumbnail URL is available', () => {
      expect(getBestYoutubeThumbnail({})).toEqual({});
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
