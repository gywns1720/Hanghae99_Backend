import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities';
import { DataSource, EntityManager } from 'typeorm';
import Orm from '@lib/common/abstract/orm.abstract';

/**
 * @Repository
 */
@Injectable()
export class ProductRepository extends Orm<ProductEntity> {
  constructor(
    readonly dataSource: DataSource,
    manager?: EntityManager,
  ) {
    super(
      ProductEntity,
      dataSource,
      manager ?? dataSource.createEntityManager(),
    );
  }

  //#region [Abstract Methods]
  async findOneItem(id: string): Promise<ProductEntity> {
    const repo = this.dataSource.getRepository(ProductEntity);
    const item = await repo.findOneBy({ p_id: id });
    if (!item) throw new Error(`Product not found. id=${id}`);
    return item;
  }

  async createItems(...entities: ProductEntity[]): Promise<void> {
    const repo = this.dataSource.getRepository(ProductEntity);
    await repo.save(entities);
  }

  async deleteItem(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(ProductEntity);
    await repo.delete(id);
  }

  async updateItem(id: string, item: Partial<ProductEntity>): Promise<void> {
    const repo = this.dataSource.getRepository(ProductEntity);
    await repo.update(id, item);
  }
  //#endregion
}
