import { Field, ObjectType } from 'type-graphql';
import { User } from '../../models/User';

@ObjectType({ description: 'User object with Token' })
export class UserWithToken {
	@Field(() => User)
	user: User;

	@Field()
	token: string;
}
