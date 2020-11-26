import { comparePassword, hashPassword } from './bcrypt';
import { generateToken, verfyToken } from './jwt';
import { generateResetToken, hashedToken } from './crypto';
import {
	passwordRecoveryTemplate,
	confirmAccountTemplate,
} from './emailTemplate';

export {
	hashPassword,
	comparePassword,
	generateToken,
	verfyToken,
	passwordRecoveryTemplate,
	confirmAccountTemplate,
	generateResetToken,
	hashedToken,
};
