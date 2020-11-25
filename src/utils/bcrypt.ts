import bcrypt from 'bcryptjs';

const saltRounds = 12;
const salt = bcrypt.genSaltSync(saltRounds);

export const hashPassword = (password: string) =>
	bcrypt.hashSync(password, salt);

export const comparePassword = (
	currentpassword: string,
	hashedPassword: string
) => bcrypt.compareSync(currentpassword, hashedPassword);
