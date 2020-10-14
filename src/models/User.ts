import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@ObjectType({ description: 'The User model' })
export class User {
	@Field(() => ID)
	@Property({ required: false })
	id: string;

	@Field()
	@Property({ required: true, trim: true })
	email: string;

	@Field()
	@Property({ required: true, trim: true })
	firstName: string;

	@Field()
	@Property({ required: false, trim: true })
	lastName: string;

	@Field()
	@Property({ required: true, trim: true })
	phoneNumber: string;

	@Field(() => Boolean)
	@Property({ required: false, default: false })
	isAdmin: boolean;

	@Field(() => ID)
	@Property({ required: true })
	uid: string;
}
export const UserModel = getModelForClass(User);
