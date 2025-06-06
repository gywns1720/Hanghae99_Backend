import { ProductEntity } from '@lib/e-commerce/mysql/entities';
import { ProductDomain } from '@lib/e-commerce/product/domain/product.domain';
import { DateUtils } from '@lib/common/utils';

export class ProductMapper {
  static toDomain(entity: ProductEntity): ProductDomain {
    const domain = new ProductDomain();
    domain.id = entity.p_id;
    domain.name = entity.name;
    domain.stock = entity.stock;
    domain.desc = entity.desc || null;
    domain.thumbnail = entity.thumbnail_id;
    domain.createdAt = DateUtils.toISOStringSafe(entity.created_at);
    domain.updatedAt = DateUtils.toISOStringSafe(entity.updated_at);
    return domain;
  }

  static toEntity(domain: ProductDomain): ProductEntity {
    const entity = new ProductEntity();
    entity.p_id = domain.id;
    entity.name = domain.name;
    entity.stock = domain.stock;
    entity.thumbnail_id = domain.thumbnail;
    entity.desc = domain.desc;
    entity.updated_at = domain.updatedAt;
    entity.created_at = domain.createdAt;
    return entity;
  }
}
