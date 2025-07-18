import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

/**
 * @Controller
 */
@ApiTags('User')
@Controller('user/sign')
export class UserSignController {
  @ApiOperation({
    summary: '로컬 로그인 [미완성]',
    description: '사용자 로컬 로그인',
  })
  @Post('in')
  async signIn() {
    return { notSupport: true };
  }
  @ApiOperation({
    summary: '로컬 회원가입 [미완성]',
    description: '사용자 로컬 회원가입',
  })
  @Post('up')
  async signUp() {
    return { notSupport: true };
  }
  @ApiOperation({
    summary: '로컬 로그아웃 [미완성]',
    description: '사용자 로컬 로그아웃',
  })
  @Post('out')
  async signOut() {
    return { notSupport: true };
  }
}
