import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { signToken } from '../../utils';
import { User, UserModel } from '../../models/User';

import { RegisterUserInput } from './input';
import { Token } from './interface';

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

	@Mutation(() => Token)
	async registerUser(@Arg('input') input: RegisterUserInput): Promise<Token> {
		const { email, phoneNumber, lastName, firstName, password } = input;
		try {
			const userCreated = await UserModel.create({
				email,
				firstName,
				lastName,
				phoneNumber,
				password,
			});
			const token = signToken(userCreated._id);
			if (token) {
				return { token };
			}

			throw new Error('User not created');
		} catch (error) {
			throw new Error(error);
		}
	}
}
