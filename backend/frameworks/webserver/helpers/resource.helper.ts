import { google } from 'googleapis';

import { Api400Error } from '../utils/response/error.response';

type YoutubeThumbnail = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
};

type YoutubeThumbnails = Partial<
  Record<'maxres' | 'standard' | 'high' | 'medium' | 'default', YoutubeThumbnail>
>;

export const extractVideoId = (url: string) => {
  const regExp =
    /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?].*)?$/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const normalizeYoutubeVideoUrl = (url: string) => {
  const videoId = extractVideoId(url.trim());
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
};

export const getBestYoutubeThumbnail = (thumbnails?: YoutubeThumbnails | null) => {
  const preferredSizes: Array<keyof YoutubeThumbnails> = [
    'maxres',
    'standard',
    'high',
    'medium',
    'default',
  ];
  const thumbnail = preferredSizes
    .map((size) => thumbnails?.[size])
    .find((thumbnail) => thumbnail?.url);

  if (!thumbnail?.url) {
    return {};
  }

  return {
    url: thumbnail.url,
    width: thumbnail.width ?? undefined,
    height: thumbnail.height ?? undefined,
  };
};

export async function fetchYoutubeVideoInfo(videoId: string) {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });

    const response = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: [videoId],
    });

    return response.data.items[0];
  } catch (error) {
    throw new Api400Error('Failed to fetch video information with given url', [error]);
  }
}
