export type VideoType = {
  _id: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnails?: {
    url?: string;
    width?: number;
    height?: number;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    dislikeCount?: string;
    commentCount?: string;
  };
  sharedBy: {
    userName: string;
    userId: string;
  };
};
