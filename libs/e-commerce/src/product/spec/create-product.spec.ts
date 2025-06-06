import CreateProductUseCase from '@lib/e-commerce/product/case/create-product-use.case';
import { IRepository } from '@lib/common/type';
import { UserDomain } from '@lib/e-commerce/user/domain/user.domain';
import { plainToInstance } from 'class-transformer';
import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';

describe('Create Product Command 관련 테스트 코드 작성 준비', () => {
  let mockUserRepo: Pick<IRepository<UserDomain>, 'findOneItem'> | null = null;
  let mockProductRepo: Pick<IRepository<ProductDomain>, 'createItems'> | null =
    null;
  let randomUtils: { uuid: () => string } | null = null;
  it('상품 생성을 위한 목업이 제대로 되었는가?', async () => {
    mockUserRepo = {
      findOneItem: jest.fn().mockResolvedValue(
        plainToInstance(UserDomain, {
          id: 'user',
          name: '목업유저',
          profile: null,
        } as UserDomain),
      ),
    };

    mockProductRepo = {
      createItems: jest.fn(),
    };
    randomUtils = {
      uuid: jest.fn().mockReturnValue('new'),
    };
    const useCase = new CreateProductUseCase(
      mockUserRepo,
      mockProductRepo,
      randomUtils,
    );

    const caseResult = await useCase.execute({
      userId: 'user',
      name: '새로운 상품',
      desc: '이 상품은 목업용입니다.',
      stock: 1000,
      thumbnail: null,
    });

    expect(caseResult).toBeDefined();
    expect(mockUserRepo.findOneItem).toHaveBeenCalled();
    expect(mockProductRepo.createItems).toHaveBeenCalled();
    expect(randomUtils.uuid).toHaveBeenCalled();
    expect(caseResult.productId).toBe('new');
  });
});
