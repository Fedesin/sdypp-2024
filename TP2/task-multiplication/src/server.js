import express from 'express';
import 'dotenv/config';
import { router } from './routes.js';

const server = express();

const port = process.env.PORT || 5001;
const host = process.env.HOST || '0.0.0.0';

server.use(express.json());
server.use(router);

server.listen(port, host, () => {
	console.log(`Task service listening on ${host}:${port}`);
});