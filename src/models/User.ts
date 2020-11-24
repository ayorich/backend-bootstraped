import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { prop as Property, getModelForClass, pre } from '@typegoose/typegoose';
import { userRole } from './types';
import { hashPassword } from '../utils';

registerEnumType(userRole, { name: 'userRole' });

@pre<User>('save', function (next: any) {
	// ONLY RUN IF PASSWORD IS NOT MODIFIED
	if (!this.isModified('password')) return next();

	// HASH THE PASSWORD
	this.password = hashPassword(this.password);

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
