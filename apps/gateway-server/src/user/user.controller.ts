import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * @Controller
 */
@ApiTags('User')
@Controller('user')
export class UserController {
  @ApiOperation({
    summary: '내 프로필 조회 [미완성]',
    description: '사용자 로컬 로그인',
  })
  @Get()
  async findMyProfile() {
    return { notSupport: true };
  }
}
