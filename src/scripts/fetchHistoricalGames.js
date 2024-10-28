import { gameHistoryService } from '../services/gameHistoryService';
import { fetchGameData } from '../services/nflService';

async function fetchHistoricalGames(startSeason, endSeason) {
    try {
        for (let season = startSeason; season <= endSeason; season++) {
            console.log(`Fetching games for season ${season}...`);

            // Fetch all games for the season
            const games = await fetchGameData(season);

            // Store each game
            for (const game of games) {
                await gameHistoryService.addGame({
                    ...game,
                    season
                });
            }
        }
        console.log('Historical game data collection complete');
    } catch (error) {
        console.error('Error fetching historical games:', error);
    }
}

// Usage:
// fetchHistoricalGames(2020, 2023);

