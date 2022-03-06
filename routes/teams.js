import express from 'express';
const teamsRouter = express.Router();
import fetch from 'node-fetch';
import { endpoint } from '../config/env.js';

// fetch teams data
let teamsData;
try {
	teamsData = await (await fetch(`${endpoint}/teams.json`)).json();
} catch (error) {
	console.log(`can't fetch data from ${endpoint}/teams.json`);
}
// fetch results data
let resultsData;
try {
	resultsData = await (await fetch(`${endpoint}/results.json`)).json();
} catch (error) {
	console.log(`can't fetch data from ${endpoint}/results.json`);
}
// filter teams data based on team id
// if 'objectMapping' is true, list of 'team object's will be returned as an object using team_id as a key
// else, list of 'team object's will be returned as an array
const filterForTeams = (data, idList, objectMapping = false) => {
	let filteredData = objectMapping ? {} : [];
	if (idList.length === 1 && idList[0] === '*') {
		if (objectMapping) {
			data.forEach((i) => {
				filteredData[i.team_id] = i;
			});
		} else {
			filteredData = data;
		}
	} else {
		data.forEach((i) => {
			if (idList.includes(i.team_id)) {
				objectMapping ? (filteredData[i.team_id] = i) : filteredData.push(i);
			}
		});
	}
	return filteredData;
};

teamsRouter.get('/', (req, res) => {
	if (teamsData) {
		res.status(200).send(teamsData);
	} else {
		res.status(503).send({ message: `${endpoint}/teams.json service is unavailable` });
	}
});

teamsRouter.get('/:ids', (req, res) => {
	if (teamsData) {
		const idList = req.params.ids.split(',');
		const filteredData = filterForTeams(teamsData, idList);
		res.status(200).send(filteredData);
	} else {
		res.status(503).send({ message: `${endpoint}/teams.json service is unavailable` });
	}
});

teamsRouter.get('/:ids/stats', (req, res) => {
	if (teamsData && resultsData) {
		const idList = req.params.ids.split(',');
		const filteredData = filterForTeams(teamsData, idList, true);
		// get list of team ids for tracking
		// the 'idList' cannot be used because it might contain '*'
		const requestedTeamIds = Object.keys(filteredData);
		requestedTeamIds.forEach(
			(i) =>
				(filteredData[i] = {
					...filteredData[i],
					home_wins: 0,
					home_losses: 0,
					home_draws: 0,
					away_wins: 0,
					away_losses: 0,
					away_draws: 0,
					points_scored: 0,
					games_played: 0,
				})
		);
		resultsData.forEach((i) => {
			const { home_team, visiting_team } = i;
			const homeTeamId = requestedTeamIds.includes(home_team.team_id) ? home_team.team_id : null;
			const awayTeamId = requestedTeamIds.includes(visiting_team.team_id) ? visiting_team.team_id : null;
			// get the scores for home and away teams
			const homeTeamScore = home_team.players.reduce((prevVal, currItem) => prevVal + currItem.points_scored, 0);
			const awayTeamScore = visiting_team.players.reduce((prevVal, currItem) => prevVal + currItem.points_scored, 0);
			if (homeTeamId) {
				const resultState =
					homeTeamScore === awayTeamScore ? 'draws' : homeTeamScore > awayTeamScore ? 'wins' : 'losses';
				// update the record with game result
				filteredData[homeTeamId][`home_${resultState}`] += 1;
				// update total score
				filteredData[homeTeamId].points_scored += homeTeamScore;
				// update total games played
				filteredData[homeTeamId].games_played += 1;
			}
			if (awayTeamId) {
				const resultState =
					awayTeamScore === homeTeamScore ? 'draws' : awayTeamScore > homeTeamScore ? 'wins' : 'losses';
				// update the record with game result
				filteredData[awayTeamId][`away_${resultState}`] += 1;
				// update total score
				filteredData[awayTeamId].points_scored += awayTeamScore;
				// update total games played
				filteredData[awayTeamId].games_played += 1;
			}
		});
		// convert object of objects into array of objects
		const output = Object.entries(filteredData).map(([key, value]) => value);
		res.status(200).send(output);
	} else {
		res.status(503).send({ message: `${endpoint}/teams.json or ${endpoint}/results.json service is unavailable` });
	}
});

export { teamsRouter };
