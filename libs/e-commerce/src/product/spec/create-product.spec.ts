import CreateProductUseCase from '@lib/e-commerce/product/case/create-product-use.case';
import { IRepository } from '@lib/common/type';
import { UserDomain } from '@lib/e-commerce/user/domain/user.domain';
import { plainToInstance } from 'class-transformer';
import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';

describe('Create Product Command 관련 테스트 코드 작성 준비', () => {
  it('상품을 생성했는가?', async () => {
    const mockUserRepo: Pick<IRepository<UserDomain>, 'findOneItem'> = {
      findOneItem: jest.fn().mockResolvedValue(
        plainToInstance(UserDomain, {
          id: 'user',
          name: '목업유저',
        } as UserDomain),
      ),
    };

    const mockProductRepo: Pick<IRepository<ProductDomain>, 'createItems'> = {
      createItems: jest.fn(),
    };

    const randomUtils = {
      uuid: jest.fn().mockResolvedValue('new'),
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
  });
});
