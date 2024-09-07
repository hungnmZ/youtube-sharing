import { IResourceRepo } from '@application/repositories/IResource.repo';
import { IResourceService } from '@application/services/IResource.serice';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { IResourceSchema } from '@frameworks/database/mongodb/models/resource.model';

import { fetchYoutubeVideoInfo } from '../helpers/resource.helper';
import { Api400Error } from '../utils/response/error.response';

import { BaseServices } from './base.service';

export class ResourceService
  extends BaseServices<IResourceSchema>
  implements IResourceService
{
  constructor(protected repo: IResourceRepo) {
    super(repo);
  }

  async share(videoId: string, userId: string): Promise<IResourceSchema> {
    const videoInfo = await fetchYoutubeVideoInfo(videoId);
    if (!videoInfo) {
      throw new Api400Error('Video is private or does not exist');
    }

    const { fullName, username } = await clerkClient.users.getUser(userId);

    const resourceData: IResourceSchema = {
      title: videoInfo.snippet?.title || '',
      description: videoInfo.snippet?.description || '',
      channelTitle: videoInfo.snippet?.channelTitle || '',
      thumbnails: videoInfo.snippet?.thumbnails.maxres || {},
      statistics: videoInfo.statistics || {},
      sharedBy: {
        userName: fullName || username || '',
        userId,
      },
    };
    const resource = await this.repo.create(resourceData);

    return resource;
  }
}
