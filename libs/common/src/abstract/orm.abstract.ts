import {
  DataSource,
  DeleteQueryBuilder,
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryRunner,
  ReplicationMode,
  Repository,
  SelectQueryBuilder,
  UpdateQueryBuilder,
  UpdateResult,
} from 'typeorm';
import {
  IOrmCreateOptions,
  IOrmUpsertOptions,
  ITransaction,
  IWhere,
} from '@lib/common/type';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

/**
 * @summary TypeORM 추상 리포지토리
 * @extends Repository
 */
export default abstract class Orm<
  T extends ObjectLiteral,
> extends Repository<T> {
  protected readonly classType: 'Repository';
  protected readonly repo: Repository<T>;
  protected constructor(
    protected readonly entity: EntityTarget<T>,
    protected readonly dataSource: DataSource,
    readonly manager: EntityManager = dataSource.createEntityManager(),
  ) {
    super(entity, manager);
    this.repo = manager.getRepository<T>(entity); // 이 repo 를 활용
    this.classType = 'Repository';
  }
  /**
   * 한개의 데이터를 검색합니다.
   * @param opts
   * @param runner
   */
  async findItemOne(opts: FindOneOptions<T>, runner?: QueryRunner) {
    try {
      const manager = this.getEntityManager(runner);
      return await manager.getRepository(this.entity).findOne(opts);
    } catch (err) {
      throw err;
    }
  }
  /**
   * 갯수를 구합니다.
   * @param opts
   * @param runner
   */
  async findItemCount(opts: FindOneOptions<T>, runner?: QueryRunner) {
    try {
      const manager = this.getEntityManager(runner);
      return await manager.getRepository(this.entity).count(opts);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 여러개의 데이터를 검색합니다.
   * @param opts
   * @param runner
   */
  async findItemMany(opts: FindManyOptions<T>, runner?: QueryRunner) {
    try {
      const manager = this.getEntityManager(runner);
      return await manager.getRepository(this.entity).find(opts);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 여러개의 데이터와 카운터를 구합니다.
   * @param opts
   * @param runner
   * @return {{total : number, payload: any[]}}
   */
  async findItemManyAndCount(opts: FindManyOptions<T>, runner?: QueryRunner) {
    const manager = this.getEntityManager(runner);
    try {
      const count: number = await this._findItemCount(manager, opts.where);
      const result = await this.findItemOne(opts, runner);
      return {
        total: count,
        payload: result,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * 카운트 갯수를 구합니다.
   * @param manager {EntityManager} 엔티티 메니져
   * @param where {FindManyOptions['where']} 조건
   * @private
   */
  private async _findItemCount(
    manager: EntityManager,
    where: FindManyOptions<T>['where'],
  ) {
    try {
      return await manager.getRepository(this.entity).count({
        where,
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * 데이터를 갱신합니다.
   * @param options {QueryDeepPartialEntity<E>} 업데이트 할 엔티티
   * @param wheres {IWhere[]} 조건 배열
   * @param runner {QueryRunner} 러너
   * @returns Promise<UpdateResult>
   */
  async updateItem(
    options: QueryDeepPartialEntity<T>,
    wheres: IWhere[],
    runner?: QueryRunner,
  ): Promise<UpdateResult> {
    try {
      const manager = this.getEntityManager(runner);
      const sql = manager
        .createQueryBuilder(this.entity, 'item', runner)
        .update()
        .set(options);
      this.setWheres(sql, wheres);
      return await sql.execute();
    } catch (err) {
      throw err;
    }
  }
  /**
   * 데이터를 삭제합니다.
   * @param wheres {IWhere[]} 검색 조건
   * @param runner {QueryRunner} 쿼리 러너
   * @throws OrmError
   */
  async deleteItem(
    wheres: IWhere[],
    runner?: QueryRunner,
  ): Promise<DeleteResult> {
    try {
      const manager = this.getEntityManager(runner);
      const sql = manager
        .createQueryBuilder(this.entity, 'item', runner)
        .delete()
        .from(this.entity);
      this.setWheres(sql, wheres);
      return await sql.execute();
    } catch (err) {
      throw err;
    }
  }

  /**
   * 데이터가 없으면 생성하고 있으면 갱신 혹은 무시합니다/
   * @param opts {IOrmUpsertOptions} 관련 옵션
   * @param runner {QueryRunner} 쿼리 러너
   */
  async upsertItem(opts: IOrmUpsertOptions<T>, runner?: QueryRunner) {
    try {
      const manager = this.getEntityManager(runner);

      if (opts.type === 'ignore') {
        const sql = manager
          .createQueryBuilder(runner)
          .insert()
          .into(this.entity)
          .values(opts.values)
          .orIgnore(opts.statement);
        await sql.execute();
        return true;
      } else {
        const sql = manager
          .createQueryBuilder(runner)
          .insert()
          .into(this.entity)
          .values(opts.values)
          .orUpdate(
            typeof opts.overwirte === 'string'
              ? [opts.overwirte]
              : opts.overwirte,
            opts.target,
            opts.config,
          );
        await sql.execute();
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * 트랜잭션을 실행합니다.
   *
   * QueryRunner 를 이용하여 실행합니다.
   * @param callback {(QueryRunner) => Promise<any>} 쿼리문을 실행할 콜백함수
   * @param mode {ReplicationMode} Database Slave, Master 로 지정할 경우 사용해야 한다.
   * @param isolationLevel {IsolationLevel} Lock 설정
   */
  async transaction<T = unknown>(
    callback: (runner: QueryRunner) => Promise<T>,
    mode?: ReplicationMode,
    isolationLevel?: IsolationLevel,
  ): Promise<ITransaction<T>> {
    const runner: QueryRunner = this.dataSource.createQueryRunner(mode);
    const isConnect = await this._runnerConnect(runner);

    // 연결 실패
    if (!isConnect) {
      return {
        payload: null,
        error: new Error(`Connect Error`),
        isSuccess: false,
      };
    }

    const isStartTransaction = await this._startTransaction(
      runner,
      isolationLevel,
    );

    // 트랜잭션 실행 실패
    if (!isStartTransaction) {
      return {
        payload: null,
        error: new Error(
          `Unable to start transaction: ${isStartTransaction ? 0 : 1}`,
        ),
        isSuccess: false,
      };
    }

    try {
      const payload: T = await callback(runner);
      await runner.commitTransaction();
      await runner.release();
      return {
        error: null,
        isSuccess: true,
        payload: !payload ? undefined : payload,
      } as unknown as ITransaction<T>;
    } catch (err) {
      await runner.rollbackTransaction();
      return {
        error: err as Error,
        isSuccess: false,
        payload: null,
      };
    }
  }

  /**
   * QueryRunner 연결 함수
   * @param runner {QueryRunner}
   * @protected
   */
  protected async _runnerConnect(runner: QueryRunner) {
    try {
      await runner.connect();
      return true;
    } catch (err) {
      console.error(
        'ORM RUNNER CONNECT ERROR ',
        !err ? 'UNKNOWN' : (err?.message ?? ''),
      );
      return false;
    }
  }
  protected async _startTransaction(
    runner: QueryRunner,
    isolationLevel?: IsolationLevel,
  ) {
    try {
      await runner.startTransaction(isolationLevel);
      return true;
    } catch (err) {
      console.error(
        'ORM Start Transcation ERROR ',
        !err ? 'UNKNOWN' : (err?.message ?? ''),
      );
      return false;
    }
  }
  /**
   * 아이템을 생성합니다.
   * @param item { QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[]}
   * @param opts {IOrmCreateOptions} 생성 옵션
   */
  async createItem(
    item: QueryDeepPartialEntity<T> | QueryDeepPartialEntity<T>[],
    opts?: IOrmCreateOptions,
  ) {
    try {
      const manager = this.getEntityManager(opts?.queryRunner);
      await manager
        .createQueryBuilder(opts?.queryRunner)
        .insert()
        .into(this.entity, opts?.columns)
        .values(item)
        .execute();
    } catch (err) {
      throw err;
    }
  }
  get ClassType(): 'Repository' {
    return this.classType;
  }

  /**
   * 쿼리 빌더에 where 조건을 설정합니다.
   * @param queryBuilder
   * @param wheres
   * @protected
   */
  protected setWheres<T>(
    queryBuilder:
      | UpdateQueryBuilder<T>
      | DeleteQueryBuilder<T>
      | SelectQueryBuilder<T>,
    wheres: IWhere[],
  ) {
    wheres.forEach((where) => {
      switch (where.type) {
        case 'and':
          queryBuilder.andWhere(where.where, where.parameters);
          break;
        case 'or':
          queryBuilder.orWhere(where.where, where.parameters);
          break;
        default:
          queryBuilder.where(where.where, where.parameters);
      }
    });
  }

  /**
   * 엔티티 메니져를 가져옵니다.
   * @param runner
   * @protected
   */
  protected getEntityManager(runner?: QueryRunner) {
    return runner ? runner.manager : this.dataSource.createEntityManager();
  }
}
