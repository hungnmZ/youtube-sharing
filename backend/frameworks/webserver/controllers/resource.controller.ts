import { IResourceService } from '@application/services/IResource.serice';
import { OK } from '@frameworks/webserver/utils/response/success.response';
import { Response } from 'express';
import { AuthenticatedRequest } from 'types/request';

import { ShareResourceDTO } from '../dtos/resource/shareResource.dto';
import { extractVideoId } from '../helpers/resource.helper';
import { SocketService } from '../services/socket.service';
import { Api400Error } from '../utils/response/error.response';

export class ResourceController {
  constructor(
    private resourceService: IResourceService,
    private socketService: SocketService,
  ) {
    this.resourceService = resourceService;
    this.socketService = socketService;
  }

  share = async (req: AuthenticatedRequest, res: Response) => {
    const shareDTO = new ShareResourceDTO(req.body as ShareResourceDTO);
    const videoId = extractVideoId(shareDTO.url);
    const { userId } = req.auth;

    if (!videoId) {
      throw new Api400Error('Please enter a valid YouTube video URL');
    }

    const videoInfo = await this.resourceService.share(videoId, userId);
    this.socketService.emitEvent(
      'resource:shared',
      JSON.stringify({
        title: videoInfo.title,
        channelTitle: videoInfo.channelTitle,
        thumbnails: videoInfo.thumbnails,
        userId,
        userName: videoInfo.sharedBy.userName,
      }),
    );

    OK({ res, data: videoInfo });
  };
}
