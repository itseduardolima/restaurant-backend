import { Controller, Get, Render } from '@nestjs/common';

@Controller('docs')
export class SwaggerController {
  @Get()
  @Render('swagger')
  root() {
    return { title: 'Swagger' };
  }
}
