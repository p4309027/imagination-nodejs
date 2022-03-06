import express from 'express';
const resultsRouter = express.Router();
import fetch from 'node-fetch';
import { endpoint } from '../config/env.js';

// fetch results data
let resultsData;
try {
	resultsData = await (await fetch(`${endpoint}/results.json`)).json();
} catch (error) {
	console.log(`can't fetch data from ${endpoint}/results.json`);
}

resultsRouter.get('/', (req, res) => {
	if (resultsData) {
		res.status(200).send(resultsData);
	} else {
		res.status(503).send({ message: `${endpoint}/results.json service is unavailable` });
	}
});

export { resultsRouter };
