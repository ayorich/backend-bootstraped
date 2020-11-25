// import express, { Server, Request, Response } from 'express';
import express, { Server, Request, Response } from 'express';
import graphQlServer from './server';

const PORT = process.env.PORT || 8360;

// Add your subscriptions

const app: Server = express();
app.get('/test', (_: Request, res: Response) => {
	res.redirect('http://localhost:8360/');
});
// const router = express.Router();

graphQlServer(app)
	.then(({ httpServer, server }) => {
		httpServer.listen(PORT, () => {
			console.log(`🚀 Server ready at 
			http://localhost:${PORT}${server.graphqlPath}`);
			console.log(`🚀 Subscriptions ready at 
		  ws://localhost:${PORT}${server.subscriptionsPath}`);
		});
	})
	.catch(err => console.log(err));

// app.listen(PORT, () => {
// 	console.log(`🚀 Server ready and listening at port  ${PORT} `);
// });
export default app;
