import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import 'reflect-metadata';

// resolvers
import resolvers from './graphql';

const graphQlServer = async (app: any) => {
	const schema = await buildSchema({
		resolvers,
		emitSchemaFile: true,
		validate: false,
	});

	// create mongoose connection
	const mongoose = await connect('mongodb://localhost:27017/fortvest', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	await mongoose.connection;

	const server = new ApolloServer({
		context: ({ req, res }) => ({ req, res }),
		schema,
		introspection: true,
		playground: true,
	});
	server.applyMiddleware({ app, cors: true, path: '/' });
};
export default graphQlServer;
