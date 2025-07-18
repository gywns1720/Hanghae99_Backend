import { PickType } from '@nestjs/swagger';
import { UserDomain } from '@lib/e-commerce/user/domain/user.domain';
import { UserEntity } from '@lib/e-commerce/mysql/entities';
import { plainToInstance } from 'class-transformer';

/**
 * @domain 공개적인 유저
 */
export class PublishUserDomain extends PickType(UserDomain, [
  '__pk',
  'id',
  'name',
  'point',
] as const) {
  static fromEntityToDomain(entity: UserEntity, isInstance: boolean = false) {
    const dom = UserDomain.fromEntityToDomain(entity);

    if (isInstance) {
      return plainToInstance(PublishUserDomain, {
        name: dom.name,
        point: dom.point,
        id: dom.id,
        __pk: dom.__pk,
      });
    }
    return {
      name: dom.name,
      point: dom.point,
      id: dom.id,
      __pk: dom.__pk,
    } as PublishUserDomain;
  }
}
