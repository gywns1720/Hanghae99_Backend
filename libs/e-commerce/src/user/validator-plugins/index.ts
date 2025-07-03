// #region [EXPORT]

import { IValidatorPlugin } from '@lib/e-commerce/user/validator-plugins/i-validator-plugin';
import { PasswordValidatorPlugin } from '@lib/e-commerce/user/validator-plugins/password-validator.plugin';
import { AccountExistenceCheckerPlugin } from '@lib/e-commerce/user/validator-plugins/account-existence-checker.plugin';

const UserValidatorPlugins = {
  Plugins: [
    new AccountExistenceCheckerPlugin(),
    new PasswordValidatorPlugin(),
  ] as IValidatorPlugin[],
  Inject: 'user:validator:plugins',
};
export default UserValidatorPlugins;
// #endregion
