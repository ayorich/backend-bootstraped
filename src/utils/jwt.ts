import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const signToken = (id: string) =>
	jwt.sign({ id }, JWT_SECRET || 'iIDYPmLBxnaZNApv8Z', {
		expiresIn: JWT_EXPIRES_IN,
	});
