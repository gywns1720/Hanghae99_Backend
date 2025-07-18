// #region [EXPORT]
import { Provider } from '@nestjs/common';
import { CreateUserCommandHandler } from '@lib/e-commerce/user/handler/create-user-command.handler';
import { FindUserQueryHandler } from '@lib/e-commerce/user/handler/find-user-query.handler';
import { ValidatorUserCommandHandler } from '@lib/e-commerce/user/handler/validator-user-command.handler';

const UserCQRSHandlers: Provider[] = [
  CreateUserCommandHandler,
  FindUserQueryHandler,
  ValidatorUserCommandHandler,
];
export default UserCQRSHandlers;
// #endregion
