import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { prop as Property, getModelForClass, pre } from '@typegoose/typegoose';
import { userRole } from './types';

registerEnumType(userRole, { name: 'userRole' });

@pre<User>('save', function (next: any) {
	if (this.password !== this.passwordConfirm) {
		throw new Error('Password are not the same');
	}
	next();
})
@ObjectType({ description: 'The User model' })
export class User {
	@Field(() => ID)
	@Property({ required: false })
	id: string;

	@Field()
	@Property({ required: true, trim: true, unique: true })
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

	@Field()
	@Property({ required: true, trim: true, select: false })
	password: string;

	@Field()
	@Property({ required: true, trim: true, select: false })
	passwordConfirm: string;

	@Field()
	@Property({ required: false })
	passwordChangedAt?: Date;

	@Field()
	@Property({ required: false })
	passwordResetExpires?: Date;

	@Field()
	@Property({ required: false })
	passwordResetToken?: string;

	@Field(_type => userRole)
	@Property({ required: false, default: userRole.USER })
	role?: userRole;
}
export const UserModel = getModelForClass(User);
