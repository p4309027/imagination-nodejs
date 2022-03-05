const http = require('http');

const fetch = (url) => new Promise( (resolve, reject) => {
  http.get( url, { headers: { 'x-api-key': '06c47d56-614f-4577-8e85-c88e31c5e8e5' } }, (response) => {
    let content = ''
    response.on('data', function (data) {
        content += data;
    });
    response.on('end', function () {
      try {
        resolve( JSON.parse(content) );
      } catch (e) {
        reject(e);
      }
    })
  })
});

const report = (msg, fn) => {
  const result = fn();
  if (result === true) {
    console.log( '[SUCCESS]', msg );
  } else {
    console.log( '[FAILED because ' + result + ']', msg );
  }
}

const test = (fn) => {
  try {
    return fn();
  } catch (e) {
    return e.toString();
  }
}

const isEqual = (a, b) => {
  const aType = a.constructor.name;
  const bType = b.constructor.name;
  if (aType !== bType) {
    throw "data types do not match"
  }
  switch (aType) {
    case 'Array':
      if (a.length !== b.length) {
        throw "array lengths do not match"
      }
      for (let ix=0; ix<a.length; ix++) {
        const match = test( () => isEqual( a[ix], b[ix] ) );
        if (match!==true) {
          throw match;
        }
      }
      break;
    case 'Object':
      if (Object.keys(a).length !== Object.keys(b).length) {
        throw "object keys mismatch";
      }
      Object.keys(a).forEach( key => {
        const match = test( () => isEqual(a[key], b[key]));
        if (match!==true) {
          throw `object mismatch`;
        }
      });
      break;
    default:
      return a === b;
  }
  return true;
}


( async () => {

    const source_teams = await fetch( `http://candidates.imagination.net/data/league/teams.json` );
    const source_players = await fetch( `http://candidates.imagination.net/data/league/players.json` );
    const source_results = await fetch( `http://candidates.imagination.net/data/league/results.json` );

    let api_result;

    // ----------------------------------------------------------------------------------------------------------------------------

    api_result = await fetch( `http://localhost:8099/teams` )
    report( `http://localhost:8099/teams`,  () => test( () => isEqual( api_result, source_teams  ) ) );  

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/teams/thsc` )
    report( `http://localhost:8099/teams/thsc`,  () => test( () => isEqual( api_result, 
      [
        {
          "team_id": "thsc",
          "name": "The Scorpions"
        }
      ]
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/teams/eade,xyz,thsc` )
    report( `http://localhost:8099/teams/eade,xyz,thsc`,  () => test( () => isEqual( api_result, 
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
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/teams/*` )
    report( `http://localhost:8099/teams/*`,  () => test( () => isEqual( api_result, source_teams ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/teams/thsc/stats` )
    report( `http://localhost:8099/teams/thsc/stats`,  () => test( () => isEqual( api_result, 
      [
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
    ) ) );
    
    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/teams/eade,xyz,thsc/stats` )
    report( `http://localhost:8099/teams/eade,xyz,thsc/stats`,  () => test( () => isEqual( api_result, 
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
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/teams/*/stats` )
    report( `http://localhost:8099/teams/*/stats`,  () => test( () => isEqual( api_result, 
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
          "team_id": "thti",
          "name": "The Titans",
          "home_wins": 5,
          "home_losses": 3,
          "home_draws": 1,
          "away_wins": 2,
          "away_losses": 4,
          "away_draws": 3,
          "points_scored": 81,
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
        },
        {
          "team_id": "anst",
          "name": "Anaconda Strikers",
          "home_wins": 2,
          "home_losses": 2,
          "home_draws": 5,
          "away_wins": 4,
          "away_losses": 3,
          "away_draws": 2,
          "points_scored": 92,
          "games_played": 18
        },
        {
          "team_id": "chbu",
          "name": "Charging Buffalos",
          "home_wins": 5,
          "home_losses": 3,
          "home_draws": 1,
          "away_wins": 3,
          "away_losses": 5,
          "away_draws": 1,
          "points_scored": 89,
          "games_played": 18
        },
        {
          "team_id": "piat",
          "name": "Pirates of Atlantis",
          "home_wins": 7,
          "home_losses": 1,
          "home_draws": 1,
          "away_wins": 2,
          "away_losses": 4,
          "away_draws": 3,
          "points_scored": 94,
          "games_played": 18
        },
        {
          "team_id": "roth",
          "name": "Rolling Thunder",
          "home_wins": 2,
          "home_losses": 4,
          "home_draws": 3,
          "away_wins": 6,
          "away_losses": 1,
          "away_draws": 2,
          "points_scored": 86,
          "games_played": 18
        },
        {
          "team_id": "viwa",
          "name": "Victory Warriors",
          "home_wins": 4,
          "home_losses": 3,
          "home_draws": 2,
          "away_wins": 3,
          "away_losses": 5,
          "away_draws": 1,
          "points_scored": 90,
          "games_played": 18
        },
        {
          "team_id": "mimu",
          "name": "The Mighty Mustangs",
          "home_wins": 3,
          "home_losses": 5,
          "home_draws": 1,
          "away_wins": 5,
          "away_losses": 3,
          "away_draws": 1,
          "points_scored": 94,
          "games_played": 18
        },
        {
          "team_id": "gopa",
          "name": "The Golden Panthers",
          "home_wins": 1,
          "home_losses": 6,
          "home_draws": 2,
          "away_wins": 3,
          "away_losses": 4,
          "away_draws": 2,
          "points_scored": 86,
          "games_played": 18
        }
      ]
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/players` )
    report( `http://localhost:8099/players`,  () => test( () => isEqual( api_result, source_players  ) ) );  

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/players/P001` )
    report( `http://localhost:8099/players/P001`,  () => test( () => isEqual( api_result, 
      [
        {
          "player_id": "P001",
          "name": "Stephen Radcliffe",
          "age": 40,
          "team_id": "mimu"
        }
      ]
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/players/P001,C123,P002` )
    report( `http://localhost:8099/players/P001,C123,P002`,  () => test( () => isEqual( api_result, 
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
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/players/*` )
    report( `http://localhost:8099/players/*`,  () => test( () => isEqual( api_result, source_players ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/players/P001/stats` )
    report( `http://localhost:8099/players/P001/stats`,  () => test( () => isEqual( api_result, 
      [
        {
          "player_id": "P001",
          "name": "Stephen Radcliffe",
          "age": 40,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 11,
          "points_scored": 3
        }
      ]
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/players/P001,C123,P002/stats` )
    report( `http://localhost:8099/players/P001,C123,P002/stats`,  () => test( () => isEqual( api_result, 
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
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/players/*/stats` )
    report( `http://localhost:8099/players/*/stats`,  () => test( () => isEqual( api_result, 
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
        },
        {
          "player_id": "P003",
          "name": "Stephen Martin",
          "age": 35,
          "team_id": "chbu",
          "team_name": "Charging Buffalos",
          "games_played": 13,
          "points_scored": 8
        },
        {
          "player_id": "P004",
          "name": "Robert West",
          "age": 31,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 12,
          "points_scored": 12
        },
        {
          "player_id": "P005",
          "name": "Orson Lindbergh",
          "age": 37,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 12,
          "points_scored": 10
        },
        {
          "player_id": "P006",
          "name": "Lady Clinton",
          "age": 34,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 11,
          "points_scored": 12
        },
        {
          "player_id": "P007",
          "name": "Michael Hanks",
          "age": 41,
          "team_id": "chbu",
          "team_name": "Charging Buffalos",
          "games_played": 9,
          "points_scored": 11
        },
        {
          "player_id": "P008",
          "name": "Ludwig McPherson",
          "age": 40,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 10,
          "points_scored": 11
        },
        {
          "player_id": "P009",
          "name": "Simon Beethoven",
          "age": 29,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 11,
          "points_scored": 9
        },
        {
          "player_id": "P010",
          "name": "Jessica Lindbergh",
          "age": 28,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 11,
          "points_scored": 10
        },
        {
          "player_id": "P011",
          "name": "Miley Murray",
          "age": 29,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 11,
          "points_scored": 8
        },
        {
          "player_id": "P012",
          "name": "Brad Pitt",
          "age": 35,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 10,
          "points_scored": 8
        },
        {
          "player_id": "P013",
          "name": "Elizabeth Lennon",
          "age": 38,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 10,
          "points_scored": 8
        },
        {
          "player_id": "P014",
          "name": "Elizabeth Twain",
          "age": 21,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 13,
          "points_scored": 13
        },
        {
          "player_id": "P015",
          "name": "Hilary Kardashian",
          "age": 20,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 6,
          "points_scored": 6
        },
        {
          "player_id": "P016",
          "name": "Orson Jackman",
          "age": 36,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 9,
          "points_scored": 11
        },
        {
          "player_id": "P017",
          "name": "Hilary Disney",
          "age": 33,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 11,
          "points_scored": 15
        },
        {
          "player_id": "P018",
          "name": "Hugh Dickens",
          "age": 35,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 10,
          "points_scored": 12
        },
        {
          "player_id": "P019",
          "name": "Christopher Love",
          "age": 23,
          "team_id": "chbu",
          "team_name": "Charging Buffalos",
          "games_played": 12,
          "points_scored": 13
        },
        {
          "player_id": "P020",
          "name": "Stephen Mozart",
          "age": 28,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 12,
          "points_scored": 11
        },
        {
          "player_id": "P021",
          "name": "Stanley Picasso",
          "age": 33,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 13,
          "points_scored": 16
        },
        {
          "player_id": "P022",
          "name": "Steve Jackman",
          "age": 33,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 13,
          "points_scored": 15
        },
        {
          "player_id": "P023",
          "name": "Alfred Jackman",
          "age": 27,
          "team_id": "chbu",
          "team_name": "Charging Buffalos",
          "games_played": 12,
          "points_scored": 10
        },
        {
          "player_id": "P024",
          "name": "Courtney Warhol",
          "age": 23,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 11,
          "points_scored": 12
        },
        {
          "player_id": "P025",
          "name": "Elizabeth Carrey",
          "age": 25,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 12,
          "points_scored": 12
        },
        {
          "player_id": "P026",
          "name": "Mae Beckham",
          "age": 37,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 13,
          "points_scored": 10
        },
        {
          "player_id": "P027",
          "name": "Simon Lincoln",
          "age": 39,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 13,
          "points_scored": 12
        },
        {
          "player_id": "P028",
          "name": "Charles Cowell",
          "age": 34,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 9,
          "points_scored": 11
        },
        {
          "player_id": "P029",
          "name": "Bill Pitt",
          "age": 31,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 13,
          "points_scored": 17
        },
        {
          "player_id": "P030",
          "name": "David Hanks",
          "age": 35,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 10,
          "points_scored": 11
        },
        {
          "player_id": "P031",
          "name": "Orson Streep",
          "age": 37,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 9,
          "points_scored": 7
        },
        {
          "player_id": "P032",
          "name": "John Federer",
          "age": 37,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 14,
          "points_scored": 10
        },
        {
          "player_id": "P033",
          "name": "Nicole Lincoln",
          "age": 21,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 11,
          "points_scored": 13
        },
        {
          "player_id": "P034",
          "name": "Matt Charles",
          "age": 21,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 11,
          "points_scored": 13
        },
        {
          "player_id": "P035",
          "name": "George Ford",
          "age": 26,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 12,
          "points_scored": 9
        },
        {
          "player_id": "P036",
          "name": "Hugh Einstein",
          "age": 36,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 13,
          "points_scored": 12
        },
        {
          "player_id": "P037",
          "name": "George Taylor",
          "age": 20,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 9,
          "points_scored": 8
        },
        {
          "player_id": "P038",
          "name": "Julia Disney",
          "age": 28,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 15,
          "points_scored": 17
        },
        {
          "player_id": "P039",
          "name": "Andrew Hope",
          "age": 21,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 11,
          "points_scored": 8
        },
        {
          "player_id": "P040",
          "name": "Mae Ford",
          "age": 24,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 10,
          "points_scored": 10
        },
        {
          "player_id": "P041",
          "name": "Daniel Pitt",
          "age": 35,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 9,
          "points_scored": 10
        },
        {
          "player_id": "P042",
          "name": "Ray Welles",
          "age": 34,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 15,
          "points_scored": 16
        },
        {
          "player_id": "P043",
          "name": "Bill Beethoven",
          "age": 23,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 12,
          "points_scored": 7
        },
        {
          "player_id": "P044",
          "name": "Jay Austen",
          "age": 24,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 9,
          "points_scored": 6
        },
        {
          "player_id": "P045",
          "name": "Simon Roberts",
          "age": 18,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 13,
          "points_scored": 12
        },
        {
          "player_id": "P046",
          "name": "Paris Hope",
          "age": 36,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 9,
          "points_scored": 12
        },
        {
          "player_id": "P047",
          "name": "George Astaire",
          "age": 18,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 13,
          "points_scored": 15
        },
        {
          "player_id": "P048",
          "name": "Oprah Nicholson",
          "age": 23,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 9,
          "points_scored": 7
        },
        {
          "player_id": "P049",
          "name": "Meryl Monroe",
          "age": 41,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 12,
          "points_scored": 10
        },
        {
          "player_id": "P050",
          "name": "Walt Perry",
          "age": 25,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 13,
          "points_scored": 14
        },
        {
          "player_id": "P051",
          "name": "Lewis Jobs",
          "age": 31,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 13,
          "points_scored": 10
        },
        {
          "player_id": "P052",
          "name": "Oprah Welles",
          "age": 33,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 13,
          "points_scored": 12
        },
        {
          "player_id": "P053",
          "name": "Jane Radcliffe",
          "age": 20,
          "team_id": "roth",
          "team_name": "Rolling Thunder",
          "games_played": 9,
          "points_scored": 10
        },
        {
          "player_id": "P054",
          "name": "George Lincoln",
          "age": 21,
          "team_id": "chbu",
          "team_name": "Charging Buffalos",
          "games_played": 15,
          "points_scored": 15
        },
        {
          "player_id": "P055",
          "name": "Abraham Cyrus",
          "age": 19,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 13,
          "points_scored": 14
        },
        {
          "player_id": "P056",
          "name": "Jessica Twain",
          "age": 30,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 11,
          "points_scored": 13
        },
        {
          "player_id": "P057",
          "name": "Jessica Minogue",
          "age": 33,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 9,
          "points_scored": 11
        },
        {
          "player_id": "P058",
          "name": "Benjamin Williams",
          "age": 37,
          "team_id": "piat",
          "team_name": "Pirates of Atlantis",
          "games_played": 10,
          "points_scored": 12
        },
        {
          "player_id": "P059",
          "name": "Thomas Austen",
          "age": 18,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 10,
          "points_scored": 11
        },
        {
          "player_id": "P060",
          "name": "Paris Mozart",
          "age": 35,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 8,
          "points_scored": 6
        },
        {
          "player_id": "P061",
          "name": "Benjamin Mozart",
          "age": 20,
          "team_id": "chbu",
          "team_name": "Charging Buffalos",
          "games_played": 10,
          "points_scored": 13
        },
        {
          "player_id": "P062",
          "name": "Brad Gaga",
          "age": 24,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 8,
          "points_scored": 6
        },
        {
          "player_id": "P063",
          "name": "Thomas Jobs",
          "age": 25,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 12,
          "points_scored": 12
        },
        {
          "player_id": "P064",
          "name": "Oprah Clinton",
          "age": 23,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 14,
          "points_scored": 14
        },
        {
          "player_id": "P065",
          "name": "Christopher Gaga",
          "age": 24,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 11,
          "points_scored": 9
        },
        {
          "player_id": "P066",
          "name": "Lewis Jordan",
          "age": 22,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 11,
          "points_scored": 11
        },
        {
          "player_id": "P067",
          "name": "Elle Jackman",
          "age": 24,
          "team_id": "chbu",
          "team_name": "Charging Buffalos",
          "games_played": 9,
          "points_scored": 8
        },
        {
          "player_id": "P068",
          "name": "Mae Boyle",
          "age": 24,
          "team_id": "anst",
          "team_name": "Anaconda Strikers",
          "games_played": 11,
          "points_scored": 13
        },
        {
          "player_id": "P069",
          "name": "Ray Perry",
          "age": 36,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 9,
          "points_scored": 4
        },
        {
          "player_id": "P070",
          "name": "Thomas Simpson",
          "age": 40,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 14,
          "points_scored": 16
        },
        {
          "player_id": "P071",
          "name": "Susan Taylor",
          "age": 33,
          "team_id": "thsc",
          "team_name": "The Scorpions",
          "games_played": 13,
          "points_scored": 13
        },
        {
          "player_id": "P072",
          "name": "Jack Perry",
          "age": 36,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 14,
          "points_scored": 15
        },
        {
          "player_id": "P073",
          "name": "Alfred Boyle",
          "age": 34,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 9,
          "points_scored": 8
        },
        {
          "player_id": "P074",
          "name": "Sean Lennon",
          "age": 28,
          "team_id": "thti",
          "team_name": "The Titans",
          "games_played": 13,
          "points_scored": 7
        },
        {
          "player_id": "P075",
          "name": "Orson Leno",
          "age": 34,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 13,
          "points_scored": 18
        },
        {
          "player_id": "P076",
          "name": "Miley Carroll",
          "age": 22,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 10,
          "points_scored": 16
        },
        {
          "player_id": "P077",
          "name": "Robin Jefferson",
          "age": 36,
          "team_id": "eade",
          "team_name": "Eagles Defenders",
          "games_played": 10,
          "points_scored": 7
        },
        {
          "player_id": "P078",
          "name": "Alfred Cyrus",
          "age": 39,
          "team_id": "viwa",
          "team_name": "Victory Warriors",
          "games_played": 12,
          "points_scored": 10
        },
        {
          "player_id": "P079",
          "name": "Christopher Roberts",
          "age": 22,
          "team_id": "gopa",
          "team_name": "The Golden Panthers",
          "games_played": 15,
          "points_scored": 19
        },
        {
          "player_id": "P080",
          "name": "Kurt Darwin",
          "age": 37,
          "team_id": "mimu",
          "team_name": "The Mighty Mustangs",
          "games_played": 9,
          "points_scored": 11
        }
      ]
    ) ) );

    // ----------------------------------------------------------------------------------------------------------------------------
    
    api_result = await fetch( `http://localhost:8099/results` )
    report( `http://localhost:8099/results`,  () => test( () => isEqual( api_result, source_results ) ) );  

  })();

  
