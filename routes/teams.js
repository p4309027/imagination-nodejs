import express from 'express';
const teamsRouter = express.Router();
import { endpoint } from '../config/env.js';

teamsRouter.get('/', (req, res) => {
	res.send({endpoint});
});

export { teamsRouter};
