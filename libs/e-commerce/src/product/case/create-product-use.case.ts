import { ICreateItems, IFindOneItem } from '@lib/common/type';
import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';
import { CreateProductCaseDto } from '@lib/e-commerce/product/case/create-product-case.dto';
import { ICreateProductResponse } from '@lib/e-commerce/product/interface';
import { UserDomain } from '@lib/e-commerce/user/domain/user.domain';
import { RandomUtils } from '@lib/common/utils';
import { ProductError } from '@lib/e-commerce/product/product.error';
import { plainToInstance } from 'class-transformer';

/**
 * @summary 테스트 코드에 사용하는 제품 관련
 */
export default class CreateProductUseCase {
  constructor(
    protected readonly userRepo: IFindOneItem<UserDomain>,
    protected readonly produceRepo: ICreateItems<ProductDomain>,
    protected readonly randomUtils: RandomUtils,
  ) {}

  async execute(dto: CreateProductCaseDto): Promise<ICreateProductResponse> {
    // 1. 누가 제품을 추가하는지에 대해 유저 검색
    const userInfo = await this.userRepo.findOneItem(dto.userId);
    // 2. 제품 아이디 부여
    const newProductId = this.randomUtils.uuid();

    // 유저가 없는 경우 예외 발생
    if (userInfo === null) {
      throw ProductError.NotFoundUser();
    }

    const today = new Date().toUTCString();

    // 제품 생성
    await this.produceRepo.createItems(
      plainToInstance(ProductDomain, {
        id: newProductId,
        createdAt: today,
        updatedAt: today,
        stock: Math.abs(dto.stock),
        ...dto,
      }),
    );

    return {
      productId: newProductId,
    };
  }
}
