// import express, { Server, Request, Response } from 'express';
import express, { Server, Request, Response } from 'express';
// import graphQlServer from './server';

import graphQlServer from './server';

const PORT = process.env.PORT || 5555;

// Add your subscriptions

const app: Server = express();
app.get('/test', (_: Request, res: Response) => {
	res.send('bootstrap Home');
});
// const router = express.Router();
graphQlServer(app).catch(err => console.log(err));

app.listen(PORT, () => {
	console.log(`🚀 Server ready and listening at port  ${PORT} `);
});
export default app;
