# **NodeJS Developer Brief**

## **Overview**

A recent sports tournament took place involving 10 teams.

Each team played all the other teams twice, one game at home and the other away, meaning that each team played 18 matches.

Each team has 8 players, although only 5 players are chosen to play per match.

All the results from the tournament have been captured and are available in JSON format.

The following 3 JSON files are available...

**Team Data...**

* [http://candidates.imagination.net/data/league/teams.json](http://candidates.imagination.net/data/league/teams.json)

**Player Data...**

* [http://candidates.imagination.net/data/league/players.json](http://candidates.imagination.net/data/league/players.json)

**Results Data...**

* [http://candidates.imagination.net/data/league/results.json](http://candidates.imagination.net/data/league/results.json)

## **Project Deliverables**

For this project, a NodeJS based API is required to be implemented that provides various endpoints to enable the data to be explored in more detail.

All calls to the API must support an API Key. The key should be supplied by the consumer of the API via the header of the request e.g.

| name | value |
|---|---|
| x-api-key | 06c47d56-614f-4577-8e85-c88e31c5e8e5 |

If the api key is missing or invalid then a 401 status should be returned.

The API backend should cache the 3 JSON files above and not request them for every API call.


## **API Definition**

The API should support the following endpoints...

* `/teams`
* `/teams/:ids`
* `/teams/:ids/stats`
* `/players`
* `/players/:ids`
* `/players/:ids/stats`
* `/results`
---
### **/teams**

This endpoint should simply return the complete `teams.json` without modification.

Request Details...

|Name|Value|
|-|-|
| `Method` | `GET` |
| `Content-Type` | `application/json` |
| `Headers` | `x-api-key:<API_KEY>` |
| `Status Code` | `200` (Success) |
| `Status Code` | `401` (Unauthorised) |


Example Request...

[GET] http://localhost:8099/teams

Example Response...
```json
[
  {
    "team_id": "eade",
    "name": "Eagles Defenders"
  },
  {
    "team_id": "thti",
    "name": "The Titans"
  },
  {
    "team_id": "thsc",
    "name": "The Scorpions"
  },
  {
    "team_id": "anst",
    "name": "Anaconda Strikers"
  }
  ...
]
```
---
### **/teams/:ids**

This endpoint can return 1 or many teams items.

The `:ids` path value can be one of the following format...

* A single team id e.g. `http://localhost:8099/teams/eade`
* Multiple team ids (comma delimited) e.g. `http://localhost:8099/teams/eade,thti,thsc`
* All teams (asterisk) e.g. `http://localhost:8099/teams/*`

The response from this call will be an array of teams, e.g. 1 array item per requested team id. 

Note - if an invalid team id is requested then do not return an array item for that team e.g.

If the requesting `eade,xyz,thti`, then only 2 items should be returned in the array as `xyz` does not exist. If all team Ids are invalid, then an empty array should be returned.

Each item within the response array should include the following values for each team requested...

| Name | Details |
|-|-|
|`team_id`| (String) Id of the team |
|`name`| (String) Name of the team |

Request Details...

|Name|Value|
|-|-|
| `Method` | `GET` |
| `Content-Type` | `application/json` |
| `Headers` | `x-api-key:<API_KEY>` |
| `Status-Code` | `200` (Success) |
| `Status Code` | `401` (Unauthorised) |

Example Request...

[GET] http://localhost:8099/teams/eade,xyz,thsc

Example Response...
```json
[
  {
    "team_id": "eade",
    "name": "Eagles Defenders"
  },
  {
    "team_id": "thsc",
    "name": "The Scorpions"
  }
]
```
---
### **/teams/:ids/stats**

This endpoint can return 1 or many teams and their associated statistics.

The `:ids` path value should support the same format as the `/team/:ids` endpoint above.

The response from this call will be an array of team stats, e.g. 1 array item per requested team id. 

Note - if an invalid team id is requested then do not return an array item for that team e.g.

If the requesting `eade,xyz,thti`, then only 2 items should be returned in the array as `xyz` does not exist. If all team Ids are invalid, then an empty array should be returned.

Each item within the response array should include the following values for each team requested...

| Name | Details |
|-|-|
|`team_id`| (String) Id of the team |
|`name`| (String) Name of the team |
|`home_wins`| (Integer) The number of match wins for the team when played at home |
|`home_losses`| (Integer) The number of match losses for the team when played at home |
|`home_draws`| (Integer) The number of matches drawn with the visiting team |
|`away_wins`| (Integer) The number of match wins for the team when played as the visiting team |
|`away_losses`| (Integer) The number of match losses for the team when played as the visiting team |
|`away_draws`| (Integer) The number of matches drawn with the visiting team when played as the visiting team|
|`points_scored`| (Integer) Total points scored for this team (both home and away) |
|`games_played`| (Integer) Total number of games played (both home and away) |

Note - all the above values (except `team_id` and `name`) should be calculated from the `results.json`.

Request Details...

|Name|Value|
|-|-|
| `Method` | `GET` |
| `Content-Type` | `application/json` |
| `Headers` | `x-api-key:<API_KEY>` |
| `Status-Code` | `200` (Success) |
| `Status Code` | `401` (Unauthorised) |

Example Request...

[GET] http://localhost:8099/teams/eade,xyz,thsc/stats

Example Response...
```json
[
  {
    "team_id": "eade",
    "name": "Eagles Defenders",
    "home_wins": 4,
    "home_losses": 4,
    "home_draws": 1,
    "away_wins": 2,
    "away_losses": 6,
    "away_draws": 1,
    "points_scored": 87,
    "games_played": 18
  },
  {
    "team_id": "thsc",
    "name": "The Scorpions",
    "home_wins": 6,
    "home_losses": 2,
    "home_draws": 1,
    "away_wins": 3,
    "away_losses": 4,
    "away_draws": 2,
    "points_scored": 89,
    "games_played": 18
  }
]
```
---
### **/players**

This endpoint should simply return the complete `players.json` without modification.

Request Details...

|Name|Value|
|-|-|
| `Method` | `GET` |
| `Content-Type` | `application/json` |
| `Headers` | `x-api-key:<API_KEY>` |
| `Status Code` | `200` (Success) |
| `Status Code` | `401` (Unauthorised) |


Example Request...

[GET] http://localhost:8099/players

Example Response...
```json
[
  {
    "player_id": "P001",
    "name": "Stephen Radcliffe",
    "age": 40,
    "team_id": "mimu"
  },
  {
    "player_id": "P002",
    "name": "Bob Gaga",
    "age": 21,
    "team_id": "chbu"
  },
  {
    "player_id": "P003",
    "name": "Stephen Martin",
    "age": 35,
    "team_id": "chbu"
  },
  {
    "player_id": "P004",
    "name": "Robert West",
    "age": 31,
    "team_id": "piat"
  },
  {
    "player_id": "P005",
    "name": "Orson Lindbergh",
    "age": 37,
    "team_id": "thti"
  },
  {
    "player_id": "P006",
    "name": "Lady Clinton",
    "age": 34,
    "team_id": "eade"
  },
  ...
]
```
---
### **/players/:ids**

This endpoint can return 1 or many players items.

The `:ids` path value can be one of the following format...

* A single player id e.g. `http://localhost:8099/players/P001`
* Multiple player ids (comma delimited) e.g. `http://localhost:8099/players/P001,P002,P003`
* All players (asterisk) e.g. `http://localhost:8099/players/*`

The response from this call will be an array of teams, e.g. 1 array item per requested player id. 

Note - if an invalid player id is requested then do not return an array item for that player e.g.

If the requesting `P001,C123,P002`, then only 2 items should be returned in the array as `C123` does not exist. If all player Ids are invalid, then an empty array should be returned.

Request Details...

|Name|Value|
|-|-|
| `Method` | `GET` |
| `Content-Type` | `application/json` |
| `Headers` | `x-api-key:<API_KEY>` |
| `Status-Code` | `200` (Success) |
| `Status Code` | `401` (Unauthorised) |

Example Request...

[GET] localhost:8099/players/P001,C123,P002

Example Response...
```json
[
  {
    "player_id": "P001",
    "name": "Stephen Radcliffe",
    "age": 40,
    "team_id": "mimu"
  },
  {
    "player_id": "P002",
    "name": "Bob Gaga",
    "age": 21,
    "team_id": "chbu"
  }
]
```
---
### **/players/:ids/stats**

This endpoint can return 1 or many players and their associated statistics.

The `:ids` path value should support the same format as the `/player/:ids` endpoint above.

The response from this call will be an array of player stats, e.g. 1 array item per requested player id. 

Note - if an invalid player id is requested then do not return an array item for that player e.g.

If the requesting `P001,C123,P002`, then only 2 items should be returned in the array as `C123` does not exist. If all player Ids are invalid, then an empty array should be returned.

Each item within the response array should include the following values for each player requested...

| Name | Details |
|-|-|
|`player_id`| (String) Id of the player |
|`name`| (String) Name of the player |
|`age`| (Integer) Age of the player |
|`team_id`| (String) The players team Id |
|`team_name`| (String) The players team name |
|`games_played`| (Integer) The total number of matches the player has played (both home and away) |
|`points_scored`| (Integer) The total number of points scored by the player (both home and away) |

Note - all the `games_played` and `points_scored`) should be calculated from the `results.json`.

Request Details...

|Name|Value|
|-|-|
| `Method` | `GET` |
| `Content-Type` | `application/json` |
| `Headers` | `x-api-key:<API_KEY>` |
| `Status-Code` | `200` (Success) |
| `Status Code` | `401` (Unauthorised) |

Example Request...

[GET] localhost:8099/players/P001,C123,P002/stats

Example Response...
```json
[
  {
    "player_id": "P001",
    "name": "Stephen Radcliffe",
    "age": 40,
    "team_id": "mimu",
    "team_name": "The Mighty Mustangs",
    "games_played": 11,
    "points_scored": 3
  },
  {
    "player_id": "P002",
    "name": "Bob Gaga",
    "age": 21,
    "team_id": "chbu",
    "team_name": "Charging Buffalos",
    "games_played": 10,
    "points_scored": 11
  }
]
```
---
### **/results**

This endpoint should simply return the complete `results.json` without modification.

The results data is an array of all the matches played and each match has a home team and a visiting team. For each team, the players who played are listed with the points they scored for that particular match.

Request Details...

|Name|Value|
|-|-|
| `Method` | `GET` |
| `Content-Type` | `application/json` |
| `Headers` | `x-api-key:<API_KEY>` |
| `Status Code` | `200` (Success) |
| `Status Code` | `401` (Unauthorised) |


Example Request...

[GET] http://localhost:8099/results

Example Response...
```json
[
  {
    "home_team": {
      "team_id": "eade",
      "players": [
        {
          "player_id": "P045",
          "points_scored": 0
        },
        {
          "player_id": "P070",
          "points_scored": 2
        },
        {
          "player_id": "P009",
          "points_scored": 1
        },
        {
          "player_id": "P006",
          "points_scored": 2
        },
        {
          "player_id": "P077",
          "points_scored": 1
        }
      ]
    },
    "visiting_team": {
      "team_id": "thti",
      "players": [
        {
          "player_id": "P005",
          "points_scored": 0
        },
        {
          "player_id": "P022",
          "points_scored": 2
        },
        {
          "player_id": "P074",
          "points_scored": 0
        },
        {
          "player_id": "P012",
          "points_scored": 1
        },
        {
          "player_id": "P047",
          "points_scored": 0
        }
      ]
    }
  },
  {
    "home_team": {
      "team_id": "eade",
      "players": [
        {
          "player_id": "P077",
          "points_scored": 2
        },
        {
          "player_id": "P006",
          "points_scored": 0
        },
        {
          "player_id": "P009",
          "points_scored": 0
        },
        {
          "player_id": "P056",
          "points_scored": 1
        },
        {
          "player_id": "P062",
          "points_scored": 1
        }
      ]
    },
    "visiting_team": {
      "team_id": "thsc",
      "players": [
        {
          "player_id": "P028",
          "points_scored": 2
        },
        {
          "player_id": "P060",
          "points_scored": 1
        },
        {
          "player_id": "P046",
          "points_scored": 2
        },
        {
          "player_id": "P038",
          "points_scored": 2
        },
        {
          "player_id": "P039",
          "points_scored": 0
        }
      ]
    }
  },
  ...
]
```
---
## **Development Guidelines**

* Use NodeJS v14+
* Use Express V4.
* Make good use of ES6
* Use the environment variables as supplied in the `.env` file

## **Testing and Validating Results**

A node script `validate.js` is included in the repo that can check the API results.

From a terminal window, issue the following command to validate the api...

```
node validate
```

The script will call all the end points with varying queries and will report whether it got the expect results e.g.

```
[SUCCESS] http://localhost:8099/teams
[SUCCESS] http://localhost:8099/teams/thsc
[SUCCESS] http://localhost:8099/teams/eade,xyz,thsc
[SUCCESS] http://localhost:8099/teams/*
[SUCCESS] http://localhost:8099/teams/thsc/stats
[SUCCESS] http://localhost:8099/teams/eade,xyz,thsc/stats
[SUCCESS] http://localhost:8099/teams/*/stats
[SUCCESS] http://localhost:8099/players
[SUCCESS] http://localhost:8099/players/P001
[SUCCESS] http://localhost:8099/players/P001,C123,P002
[SUCCESS] http://localhost:8099/players/*
[SUCCESS] http://localhost:8099/players/P001/stats
[SUCCESS] http://localhost:8099/players/P001,C123,P002/stats
[SUCCESS] http://localhost:8099/players/*/stats
[SUCCESS] http://localhost:8099/results
```

By examining the source of the `validate.js`, the expected results for each can can be viewed.

## **Project Completion and Submission**

Once complete, please upload to either GitHub or Bitbucket (making sure the project is publicly accessible).

Please include any build instructions with your project using a readme (in markdown format).




