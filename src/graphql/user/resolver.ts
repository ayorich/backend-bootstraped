import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { comparePassword, generateToken, verfyToken } from '../../utils';
import { User, UserModel } from '../../models/User';

import { LogInUserInput, RegisterUserInput } from './input';
import { UserWithToken } from './userWithTokenType';
import { verifyPayload } from '../type';

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

			if (!user) throw new Error('Invalid Token');
			console.log(user);
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

			return { user, token };
		} catch (error) {
			throw new Error(error);
		}
	}
}
