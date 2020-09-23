import { Controller, Get, Redirect, SetMetadata } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @SetMetadata('override-rejection', true)
  @Redirect('api')
  getApi() {
    return;
  }
}
