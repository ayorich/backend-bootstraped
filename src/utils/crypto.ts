import crypto from 'crypto';

export const generateResetToken = () => crypto.randomBytes(32).toString('hex');

export const hashedToken = (token: string) =>
	crypto.createHash('sha256').update(token).digest('hex');
