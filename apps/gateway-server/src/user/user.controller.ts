import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { KafkaService } from '@app/kafka';
import KafkaConst from '@app/kafka/kafka.const';
import {
  CreateUserDomain,
  KafkaCreateUserDomain,
  PublishUserDomain,
} from '@lib/e-commerce/user/domain';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DateUtils, RandomUtils } from '@lib/common/utils';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly httpService: HttpService,
  ) {}

  @ApiOperation({
    summary: '유저 생성',
    description:
      '유저를 생성합니다. 비동기이벤트 방식이기 때문에 유저는 이미 생성중입니다.',
  })
  @Post()
  async createUser(@Body() domain: CreateUserDomain) {
    const waitId = RandomUtils.generatorID('wait', DateUtils.today());
    // Gateway에서 User 서비스로 메시지 전송
    await this.kafkaService.sendMessage(
      KafkaConst.Topics.USER_EVENT,
      this.kafkaService.createEventMessage(KafkaConst.Actions.User.CreateUser, {
        domain,
        waitId,
      } as KafkaCreateUserDomain),
    );

    return {
      message: 'User creation request sent',
      waitId,
    };
  }

  @Get(':id')
  async findOneUser(@Param('id', new DefaultValuePipe('')) id: string) {
    if (
      !id ||
      typeof id !== 'string' ||
      id.trim().length <= 0 ||
      id.replace(/\s/g, '').trim().length <= 0 ||
      id.length >= 36
    ) {
      throw new BadRequestException('id is Invalid');
    }

    /**
     * 동기 메시지 방식으로 처리 보단 동기적으로 처리하는 방식이 좋을거 같다.
     * 단순 유저 검색이면 DB 접근 이 좋아보이고 ,대규모 분석 쿼리, PDF 생성, 로그성 조회 그런건 아래와 같은 비동기 메세지 처리 방식으로 하는게 좋아보임
     *
     * 동기방식
     * 1. HTTP 느리지만 빠르게 개발
     * 2. GRPC HTTP 보단 빠르지만 귀찮음
     * 3. Kafka 그냥 비동기
     * 4. TCP 통신 제일 빠르지만 구현난이도 높음
     */
    // await this.kafkaService.sendMessage(
    //   KafkaConst.Topics.USER_EVENT,
    //   this.kafkaService.createEventMessage(
    //     KafkaConst.Actions.User.FindOneUser,
    //     { id },
    //   ),
    // );
    // return { message: 'User retrieval request sent' };

    // ENV 있으면 BaseURL 대체
    const res = await firstValueFrom(
      this.httpService.get<{ entity: PublishUserDomain | null }>(
        `http://127.0.0.1:3001/user/${id}`,
        {
          headers: {
            API_SERVER: 'gateway-server',
          },
          withCredentials: true,
          maxRedirects: 5,
        },
      ),
    ).catch((err) => {
      console.error(err);
      return { data: { entity: null } };
    });

    if (!res.data?.entity) {
      throw new BadRequestException('Not Found User');
    }

    return PublishUserDomain.fromEntityToDomain(res.data.entity);
  }
}
