import { google } from 'googleapis';

import { Api400Error } from '../utils/response/error.response';

export const extractVideoId = (url: string) => {
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|youtu\.be\/)((\w|-){11})(?:\S+)?$/;
  const match = url.match(regExp);
  return match ? match[1] : null;
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
