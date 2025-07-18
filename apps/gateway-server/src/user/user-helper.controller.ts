import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserHelperDomain } from '@lib/e-commerce/user/domain';

/**
 * @Controller
 */
@ApiTags('User')
@Controller('user/helper')
export class UserHelperController {
  @ApiOperation({
    summary: '유저 생성 헬퍼',
    description: '비동기 상태를 체크합니다.',
  })
  @Post('create-user')
  async createUserHelper(@Body() domain: UserHelperDomain) {}
}
