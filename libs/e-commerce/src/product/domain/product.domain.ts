import { ApiProperty } from '@nestjs/swagger';
import { IProduct } from '@lib/e-commerce/product/i-product';
import { plainToInstance, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ICount, IMoney } from '@lib/common/type';
import { ProductEntity } from '@lib/e-commerce/mysql/entities';
import { IsCustomNumber } from '@lib/common/decorator';

/**
 * @domain
 */
export class ProductDomain {
  @ApiProperty({ type: Number, required: true, example: '고유 PK' })
  @IsCustomNumber()
  __pk: IProduct;

  @ApiProperty({ example: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ type: Number, required: true, example: '재고량' })
  @IsCustomNumber()
  amount: ICount;

  @ApiProperty({ type: Number, required: true, example: '단가' })
  @IsCustomNumber()
  price: IMoney;

  static fromDomainToEntity(domain: ProductDomain): ProductEntity {
    return {
      id: domain.__pk,
      amount: domain.amount,
      price: domain.price,
      title: domain.title,
    } as ProductEntity;
  }

  static fromEntityToDomain(
    entity: ProductEntity,
    parse: 'plain' | 'instance' = 'plain',
  ): ProductDomain {
    if (parse === 'instance') {
      return plainToInstance(ProductDomain, {
        __pk: entity.id,
        price: entity.price,
        title: entity.title,
        amount: entity.amount,
      } as ProductDomain);
    } else {
      return {
        __pk: entity.id,
        price: entity.price,
        title: entity.title,
        amount: entity.amount,
      } as ProductDomain;
    }
  }
}
