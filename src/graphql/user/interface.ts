import { Field, ObjectType } from 'type-graphql';

@ObjectType({ description: 'Token' })
export class Token {
	@Field()
	token: string;
}
