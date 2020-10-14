import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import config from './config';

import 'reflect-metadata';

// resolvers
import resolvers from './graphql';

const graphQlServer = async (app: any) => {
	// console.log(await process.cwd())
	const schema = await buildSchema({
		resolvers,
		validate: false,
		emitSchemaFile: true
	});

	// create mongoose connection
	const mongoose = await connect(config.getDbUrl(), {

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
