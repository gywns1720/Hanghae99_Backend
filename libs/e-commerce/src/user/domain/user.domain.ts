import { IsString } from 'class-validator';

/**
 * @domain
 */
export class UserDomain {
  @IsString()
  id: string;
  @IsString()
  name: string;
}
