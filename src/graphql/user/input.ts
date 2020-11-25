import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';
import { User } from '../../models/User';

@InputType()
export class RegisterUserInput implements Partial<User> {
	@Field()
	@Length(3, 25)
	firstName: string;

	@Field({ nullable: true })
	@Length(3, 25)
	lastName: string;

	@Field()
	email: string;

	@Field()
	phoneNumber: string;

	@Field()
	@Length(6, 25)
	password: string;
}

@InputType()
export class LogInUserInput implements Partial<User> {
	@Field()
	email: string;

	@Field()
	@Length(6, 25)
	password: string;
}
