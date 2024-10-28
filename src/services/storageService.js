const GAMES_KEY = 'nfl_historical_games';
const PREDICTIONS_KEY = 'nfl_predictions';

export const storageService = {
    saveGame(gameData) {
        try {
            const games = this.getGames();
            games.push({
                ...gameData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(GAMES_KEY, JSON.stringify(games));
            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    },

    getGames() {
        try {
            const games = localStorage.getItem(GAMES_KEY);
            return games ? JSON.parse(games) : [];
        } catch (error) {
            console.error('Error getting games:', error);
            return [];
        }
    },

    savePrediction(prediction) {
        try {
            const predictions = this.getPredictions();
            predictions.push({
                ...prediction,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
            return true;
        } catch (error) {
            console.error('Error saving prediction:', error);
            return false;
        }
    },

    getPredictions() {
        try {
            const predictions = localStorage.getItem(PREDICTIONS_KEY);
            return predictions ? JSON.parse(predictions) : [];
        } catch (error) {
            console.error('Error getting predictions:', error);
            return [];
        }
    }
};

