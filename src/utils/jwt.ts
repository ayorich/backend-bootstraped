import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const generateToken = (id: string) =>
	jwt.sign({ id }, JWT_SECRET || 'iIDYPmLBxnaZNApv8Z', {
		expiresIn: JWT_EXPIRES_IN,
	});

export const verfyToken = async (token: string) => {
	if (!JWT_SECRET) throw new Error('Server error');
	return jwt.verify(token, JWT_SECRET);
};
