import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { TagDto } from './dto/tag.dto';
import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { BaseController } from '../base/base.abstract-controller';

@Crud({
  model: {
    type: TagDto,
  },
  routes: BaseController.routesOptions
})
@ApiTags('Tags')
@Controller('tags')
export class TagsController implements BaseController<Tag> {
  constructor(
    public readonly service: TagsService
  ) {}
}
