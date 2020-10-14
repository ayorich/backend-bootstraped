import { Resolver, Arg, Query, Mutation } from 'type-graphql';
import { User, UserModel } from '../models/User';

import { RegisterUserInput } from './input';

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
	@Mutation(() => User)
	async registerUser(@Arg('input') input: RegisterUserInput): Promise<User> {
		const { email, phoneNumber, lastName, firstName, isAdmin, uid } = input;
		try {
			// const verify = await firebase.admin.auth().verifyIdToken(token);

			// const salt = await bcrypt.genSalt(10);
			// const hashedPassword = await bcrypt.hash(password, salt);

			const userCreated = await UserModel.create({
				email,
				firstName,
				lastName,
				phoneNumber,
				uid,
				isAdmin,
			});

			if (userCreated) {
				return userCreated;
			}

			throw new Error('User not created');
		} catch (error) {
			throw new Error(error);
		}
	}
}
