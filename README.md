## To run the app:
1. clone the project: [https://github.com/p4309027/imagination-nodejs.git](https://github.com/p4309027/imagination-nodejs.git)
2. change the directory: `cd imagination-nodejs`
3. install required packages: `npm i`
4. download `.env` file from [here](https://github.com/Imagination/nodejs-brief/blob/main/.env) and place it in the main directory of the project 
5. optional: update `.env` file by adding app hosted URL link, `LEAGUE_SERVER_HOSTNAME=app-hosted-url-link` 
6. to run the app: `npm start`
7. to test the app: `npm test`

##### **Notes for testing:** the app has been developed using `ES module import and export` statements. However, the `validate.js` file has been developed using `commonJS module system,` and the 'require()' is not defined in ES module scope. To mitigate the issue and treat the file as a CommonJS script, the file extension should be renamed to `'.cjs'`, i.e. `validate.cjs` before running the test.
<br/><br/>
---
company details: [Imagination](https://imagination.com/)

company git repo: [https://github.com/Imagination/nodejs-brief](https://github.com/Imagination/nodejs-brief)