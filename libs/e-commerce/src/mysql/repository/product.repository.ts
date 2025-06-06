import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities';
import { DataSource } from 'typeorm';
import Orm from '@lib/common/abstract/orm.abstract';

/**
 * @Repository
 */
@Injectable()
export class ProductRepository extends Orm<ProductEntity> {
  constructor(readonly dataSource: DataSource) {
    super(ProductEntity, dataSource);
  }

  //#region [Abstract Methods]
  findOneItem(id: string): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }
  createItems(...entities: ProductEntity[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteItem(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateItem(id: string, item: Partial<ProductEntity>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  //#endregion
}
