import { Resolver, Arg, Query, Mutation, Ctx } from 'type-graphql';
import {
	comparePassword,
	generateToken,
	hashedToken,
	verfyToken,
} from '../../utils';
import { User, UserModel } from '../../models/User';

import {
	ForgetPasswordInput,
	LogInUserInput,
	RegisterUserInput,
	ResetPasswordInput,
	UpdateUserPasswordInput,
} from './input';
import { UserWithToken } from './userWithTokenTypes';
import { verifyPayload } from '../types';
import { Email } from '../../services';

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: false })
	async returnSingleUser(@Arg('id') id: string) {
		return await UserModel.findById(id);
	}

	@Query(() => [User], { nullable: true })
	async returnAllUser(): Promise<User[]> {
		return await UserModel.find();
	}

	@Query(() => User)
	async currentUser(@Arg('token') token: string): Promise<User> {
		try {
			const decoded = (await verfyToken(token)) as verifyPayload;

			const user = await UserModel.findById(decoded.id);
			if (!user) throw new Error('user does not exist');

			return user;
		} catch (error) {
			throw new Error(error);
		}
	}

	@Query(() => UserWithToken)
	async logIn(@Arg('input') input: LogInUserInput): Promise<UserWithToken> {
		const { email, password } = input;
		try {
			const user = await UserModel.findOne({ email }).select('+password');
			if (!user) throw new Error('Incorrect email or password');

			const isPasswordCorrect = comparePassword(password, user.password);

			if (!isPasswordCorrect)
				throw new Error('Incorrect email or password');

			const token = generateToken(user._id);

			return { user, token };
		} catch (error) {
			throw new Error(error);
		}
	}

	@Query(() => String)
	async forgotPassword(@Arg('input') input: ForgetPasswordInput) {
		const { email, baseUrl } = input;
		try {
			const user = await UserModel.findOne({ email });
			if (!user)
				throw new Error('There is no user with this email address');

			const resetToken = await user.createPasswordResetToken();

			const resetURL = `${baseUrl}?resetToken=${resetToken}`;
			await new Email(user, resetURL).sendPasswordReset();

			return 'Reset token succefully sent to your mail box!';
		} catch (error) {
			throw new Error(error);
		}
	}

	@Mutation(() => String)
	async resetPassword(@Arg('input') input: ResetPasswordInput) {
		const { token, newPassword } = input;
		try {
			const resetToken = hashedToken(token);

			const user = await UserModel.findOne({
				passwordResetToken: resetToken,
				passwordResetExpires: { $gt: new Date(Date.now()) },
			});

			if (!user) throw new Error('Token is invalid or has expired');
			user.password = newPassword;

			// 3.UPDATE CHANGEDPASSWORDAT PROPERTY FOR USER
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save();

			return 'Password reset succefully!';
		} catch (error) {
			throw new Error(error);
		}
	}

	@Mutation(() => UserWithToken)
	async registerUser(
		@Arg('input') input: RegisterUserInput
	): Promise<UserWithToken> {
		const { email, phoneNumber, lastName, firstName, password } = input;
		try {
			const user = await UserModel.create({
				email,
				firstName,
				lastName,
				phoneNumber,
				password,
			});

			if (!user) throw new Error('User not created');

			const token = generateToken(user._id);

			const url = 'http://localhost:8360/';
			await new Email(user, url).sendWelcome();

			return { user, token };
		} catch (error) {
			throw new Error(error);
		}
	}

	@Mutation(() => UserWithToken)
	async updateUserPassword(
		@Arg('input') input: UpdateUserPasswordInput,
		@Ctx('token') token: string
	): Promise<UserWithToken> {
		const { currentPassword, newPassword } = input;
		try {
			const decoded = (await verfyToken(token)) as verifyPayload;

			const user = await UserModel.findById(decoded.id).select(
				'+password'
			);
			if (!user) throw new Error('user does not exist');

			const isPasswordCorrect = User.correctPassword(
				currentPassword,
				user.password
			);
			if (!isPasswordCorrect)
				throw new Error('Your current password is wrong.');

			user.password = newPassword;
			await user.save();

			const newToken = generateToken(user._id);

			return { user, token: newToken };
		} catch (error) {
			throw new Error(error);
		}
	}
}
