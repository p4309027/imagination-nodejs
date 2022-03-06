import express from 'express';
const playersRouter = express.Router();
import fetch from 'node-fetch';
import { endpoint, apiKey, serverHostname } from '../config/env.js';

// fetch players data
let playersData;
try {
	playersData = await (await fetch(`${endpoint}/players.json`)).json();
} catch (error) {
	console.log(`can't fetch data from ${endpoint}/players.json`);
}
// fetch results data
let resultsData;
try {
	resultsData = await (await fetch(`${endpoint}/results.json`)).json();
} catch (error) {
	console.log(`can't fetch data from ${endpoint}/results.json`);
}
// filter players data based on player id
// if 'objectMapping' is true, list of 'player object's will be returned as an object using player_id as a key
// else, list of 'player object's will be returned as an array
const filterForPlayers = (data, idList, objectMapping = false) => {
	let filteredData = objectMapping ? {} : [];
	if (idList.length === 1 && idList[0] === '*') {
		if (objectMapping) {
			data.forEach((i) => {
				filteredData[i.player_id] = i;
			});
		} else {
			filteredData = data;
		}
	} else {
		data.forEach((i) => {
			if (idList.includes(i.player_id)) {
				objectMapping ? (filteredData[i.player_id] = i) : filteredData.push(i);
			}
		});
	}
	return filteredData;
};

playersRouter.get('/', (req, res) => {
	if (playersData) {
		res.status(200).send(playersData);
	} else {
		res.status(503).send({ message: `${endpoint}/players.json service is unavailable` });
	}
});

playersRouter.get('/:ids', (req, res) => {
	if (playersData) {
		const idList = req.params.ids.split(',');
		const filteredData = filterForPlayers(playersData, idList);
		res.status(200).send(filteredData);
	} else {
		res.status(503).send({ message: `${endpoint}/players.json service is unavailable` });
	}
});

playersRouter.get('/:ids/stats', async (req, res) => {
	if (playersData && resultsData) {
		const idList = req.params.ids.split(',');
		const filteredData = filterForPlayers(playersData, idList, true);
		// get list of player ids for tracking
		// the 'idList' cannot be used because it might contain '*'
		const requestedPlayerIds = Object.keys(filteredData);
		// 'team_name' is not provided in results.json
		// hence '/teams/:ids' api needs to be called to fetch the team names
		const requestedTeamIds = Object.entries(filteredData).map(([k, v]) => v.team_id);
		const teams = await (
			await fetch(`${serverHostname}/teams/${requestedTeamIds.join(',')}`, {
				headers: { 'x-api-key': apiKey },
			})
		).json();
		const teamsTracker = {};
		// convert 'teams' array into 'teamsTracker' object
		teams.forEach((team) => (teamsTracker[team.team_id] = team.name));
		requestedPlayerIds.forEach((playerId) => {
			filteredData[playerId] = {
				...filteredData[playerId],
				team_name: teamsTracker[filteredData[playerId].team_id],
				games_played: 0,
				points_scored: 0,
			};
			resultsData.forEach((record) => {
				const { home_team, visiting_team } = record;
				[home_team, visiting_team].forEach((team) => {
					if (filteredData[playerId].team_id === team.team_id) {
						team.players.forEach((player) => {
							if (player.player_id === playerId) {
								filteredData[playerId].games_played += 1;
								filteredData[playerId].points_scored += player.points_scored;
							}
						});
					}
				});
			});
		});
		// convert object of objects into array of objects
		const output = Object.entries(filteredData).map(([key, value]) => value);
		res.status(200).send(output);
	} else {
		res.status(503).send({ message: `${endpoint}/players.json or ${endpoint}/results.json service is unavailable` });
	}
});

export { playersRouter };
