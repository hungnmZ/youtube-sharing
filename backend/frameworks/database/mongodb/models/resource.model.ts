import { model, Schema } from 'mongoose';

import { IBaseSchema } from './base.model';

export interface IResourceSchema extends IBaseSchema {
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
}

const resourceSchema = new Schema<IResourceSchema>(
  {
    title: { type: String, required: true },
    description: { type: String },
    channelTitle: { type: String, required: true },
    thumbnails: {
      url: String,
      width: Number,
      height: Number,
    },
    statistics: {
      viewCount: String,
      likeCount: String,
      dislikeCount: String,
      commentCount: String,
    },
    sharedBy: {
      userName: { type: String, required: true },
      userId: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export const ResourceModel = model<IResourceSchema>('Resource', resourceSchema);
