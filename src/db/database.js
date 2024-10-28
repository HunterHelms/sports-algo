import Dexie from 'dexie';

export const db = new Dexie('NFLPredictions');

db.version(1).stores({
    games: '++id, gameId, season, week, date, homeTeamId, awayTeamId',
    predictions: '++id, gameId, predictedHomeScore, predictedAwayScore, actualHomeScore, actualAwayScore'
});

export default db;
