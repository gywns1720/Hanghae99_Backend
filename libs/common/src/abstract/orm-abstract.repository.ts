import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import type { IRepository } from '@lib/common/type';

/**
 * @summary TypeORM 추상 리포지토리
 * @extends Repository
 * @implements IRepository
 */
export abstract class OrmAbstractRepository<T extends ObjectLiteral>
  extends Repository<T>
  implements IRepository<T>
{
  protected readonly classType: 'Repository';
  protected constructor(
    protected readonly entity: EntityTarget<T>,
    protected readonly dataSource: DataSource,
  ) {
    super(entity, dataSource.createEntityManager());
    this.classType = 'Repository';
  }
  abstract findOneItem(id: string): Promise<T>;
  abstract createItems(...entities: T[]): Promise<void>;
  abstract deleteItem(id: string): Promise<void>;
  abstract updateItem(id: string, item: Partial<T>): Promise<void>;

  get ClassType(): 'Repository' {
    return this.classType;
  }
}
