import Domain from '@lib/common/abstract/domain.abstract';
import { IMoney } from '@lib/common/type';
import { IsCustomNumber } from '@lib/common/decorator';

/**
 * @domain
 */
export class PointDomain extends Domain {
  @IsCustomNumber()
  amount: IMoney;
}
