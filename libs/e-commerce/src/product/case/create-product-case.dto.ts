import { OmitType } from '@nestjs/mapped-types';
import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';
import { IsString } from 'class-validator';

export class CreateProductCaseDto extends OmitType(ProductDomain, [
  'createdAt',
  'updatedAt',
  'id',
] as const) {
  // TODO JWT Token 검증시 제외
  @IsString()
  userId: string;
}
