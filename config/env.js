const endpoint = process.env.LEAGUE_SOURCE_ROOT_URL;
const apiKey = process.env.LEAGUE_API_KEY;
const port = process.env.LEAGUE_SERVER_PORT;
const serverHostname = process.env.LEAGUE_SERVER_HOSTNAME || 'http://localhost:8099';

export { endpoint, apiKey, port, serverHostname };