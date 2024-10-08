import { IResourceService } from '@application/services/IResource.serice';
import { OK } from '@frameworks/webserver/utils/response/success.response';
import { validate } from 'class-validator';
import { Response } from 'express';
import { AuthenticatedRequest } from 'types/request';

import { PaginationDTO } from '../dtos/pagination.dto';
import { ShareResourceDTO } from '../dtos/resource/shareResource.dto';
import { extractVideoId } from '../helpers/resource.helper';
import { SocketService } from '../services/socket.service';
import { Api400Error, Api401Error } from '../utils/response/error.response';

export class ResourceController {
  constructor(
    private resourceService: IResourceService,
    private socketService: SocketService,
  ) {
    this.resourceService = resourceService;
    this.socketService = socketService;
  }

  paginate = async (req: AuthenticatedRequest, res: Response) => {
    const paginationDTO = new PaginationDTO(req.body as PaginationDTO);
    const errors = await validate(paginationDTO);
    if (errors.length > 0) {
      throw new Api400Error('Invalid pagination data', errors);
    }

    const resources = await this.resourceService.paginate(
      paginationDTO.limit,
      paginationDTO.skip,
    );

    OK({ res, data: resources });
  };

  getAll = async (req: AuthenticatedRequest, res: Response) => {
    const resources = await this.resourceService.getAll();
    OK({ res, data: resources });
  };

  share = async (req: AuthenticatedRequest, res: Response) => {
    const shareDTO = new ShareResourceDTO(req.body as ShareResourceDTO);
    const videoId = extractVideoId(shareDTO.url);
    const userId = req.auth?.userId;

    if (!userId) {
      throw new Api401Error();
    }

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
