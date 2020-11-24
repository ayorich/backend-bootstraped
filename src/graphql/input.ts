import { InputType, Field } from 'type-graphql';
import { Length, IsEmail, IsPhoneNumber } from 'class-validator';
import { User } from '../models/User';

@InputType()
export class RegisterUserInput implements Partial<User> {
	@Field()
	@Length(3, 25)
	firstName: string;

	@Field({ nullable: true })
	@Length(3, 25)
	lastName: string;

	@Field()
	@IsEmail()
	email: string;

	@Field({ nullable: true })
	@IsPhoneNumber('NG')
	phoneNumber: string;

	@Field()
	@Length(6, 25)
	password: string;

	@Field()
	@Length(6, 25)
	passwordConfirm: string;
}
