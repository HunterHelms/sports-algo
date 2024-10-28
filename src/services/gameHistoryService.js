import db from '../db/database';

export const gameHistoryService = {
    async addGame(gameData) {
        try {
            return await db.games.add({
                gameId: gameData.gameId,
                season: gameData.season,
                week: gameData.week,
                date: new Date(gameData.date),
                homeTeam: {
                    id: gameData.homeTeam.id,
                    name: gameData.homeTeam.name,
                    stats: {
                        offensiveYardsPerGame: gameData.homeTeam.stats.offensiveYardsPerGame,
                        defensiveYardsPerGame: gameData.homeTeam.stats.defensiveYardsPerGame,
                        passYardsPerGame: gameData.homeTeam.stats.passYardsPerGame,
                        rushYardsPerGame: gameData.homeTeam.stats.rushYardsPerGame,
                        pointsPerGame: gameData.homeTeam.stats.pointsPerGame,
                        pointsAllowedPerGame: gameData.homeTeam.stats.pointsAllowedPerGame,
                        homeRecord: gameData.homeTeam.stats.homeRecord,
                        lastFiveGames: gameData.homeTeam.stats.lastFiveGames,
                        gamesPlayed: gameData.homeTeam.stats.gamesPlayed
                    }
                },
                awayTeam: {
                    // Same structure as homeTeam
                },
                result: gameData.result || null
            });
        } catch (error) {
            console.error('Error adding game:', error);
            throw error;
        }
    },

    async getTeamHistory(teamId, limit = 5) {
        try {
            return await db.games
                .where('homeTeamId').equals(teamId)
                .or('awayTeamId').equals(teamId)
                .reverse()
                .limit(limit)
                .toArray();
        } catch (error) {
            console.error('Error fetching team history:', error);
            throw error;
        }
    },

    async getGamesByWeek(season, week) {
        try {
            return await db.games
                .where(['season', 'week'])
                .equals([season, week])
                .toArray();
        } catch (error) {
            console.error('Error fetching games by week:', error);
            throw error;
        }
    },

    async getPredictionAccuracy() {
        try {
            const predictions = await db.predictions
                .where('actualHomeScore')
                .above(0)
                .toArray();

            return predictions.reduce((acc, pred) => {
                const predictedWinner = pred.predictedHomeScore > pred.predictedAwayScore ? 'home' : 'away';
                const actualWinner = pred.actualHomeScore > pred.actualAwayScore ? 'home' : 'away';
                const correct = predictedWinner === actualWinner;

                return {
                    total: acc.total + 1,
                    correct: acc.correct + (correct ? 1 : 0)
                };
            }, { total: 0, correct: 0 });
        } catch (error) {
            console.error('Error calculating prediction accuracy:', error);
            throw error;
        }
    }
};

