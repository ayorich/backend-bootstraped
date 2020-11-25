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

export const UserModel = getModelForClass(User, {
	schemaOptions: { timestamps: true },
});

// User.methods.correctPassword = async (
// 	candidatePassword,
// 	userPassword
//   ) => {
// 	const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
// 	return isCorrect;
//   };

// public static async correctPassword(...args: any[]) {
// 	console.log('hello, ' + JSON.stringify([...args], null, 2));
// 	return true;
// }
