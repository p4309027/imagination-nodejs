import express from 'express';
const app = express();
import { apiKey, port } from './config/env.js';

// built-in exprss middleware(s):
// parse incoming requests with JSON payloads using
app.use(express.json());

// custom middleware to check for 'x-api-key'
const checkApiKey = (req, res, next) => {
	const headerApiKey = req.header('x-api-key');
	if (headerApiKey !== apiKey) {
		res.status(401).send({ message: 'Unauthorised' });
	}
	next();
};
app.use(checkApiKey);

import { teamsRouter } from './routes/teams.js';
import { playersRouter }from './routes/players.js';
import { resultsRouter } from './routes/results.js';

app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/results', resultsRouter);

app.listen(port);
