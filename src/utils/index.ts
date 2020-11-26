import { comparePassword, hashPassword } from './bcrypt';
import { generateToken, verfyToken } from './jwt';
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
};
