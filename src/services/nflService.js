import axios from 'axios';
import { mockMatchups, mockTeams } from '../data/mockData'; // Temporary for testing

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl';

const getWeeklyMatchups = async (week, year = 2024) => {
    try {
        const response = await axios.get(`${ESPN_API_BASE}/scoreboard`, {
            params: { week, year, seasontype: 2 }
        });

        if (!response.data?.events?.length) {
            console.log('No events found, using mock data');
            return mockMatchups;
        }

        const matchups = await Promise.all(response.data.events.map(async event => {
            const homeTeam = event.competitions[0].competitors.find(c => c.homeAway === 'home');
            const awayTeam = event.competitions[0].competitors.find(c => c.homeAway === 'away');

            // Get logos from the team object
            const homeLogo = homeTeam.team.logo;
            const awayLogo = awayTeam.team.logo;

            // Fetch detailed stats for each team
            const [homeStats, awayStats] = await Promise.all([
                fetchTeamStats(homeTeam.team.id),
                fetchTeamStats(awayTeam.team.id)
            ]);

            return {
                id: event.id,
                week,
                gameStatus: event.status.type.name,
                gameDate: new Date(event.date),
                homeScore: homeTeam.score,
                awayScore: awayTeam.score,
                homeTeam: {
                    id: homeTeam.team.id,
                    name: homeTeam.team.name,
                    abbreviation: homeTeam.team.abbreviation,
                    logo: homeLogo,
                    homeRecord: homeTeam.records?.[0]?.summary || '0-0',
                    awayRecord: homeTeam.records?.[1]?.summary || '0-0',
                    lastFiveGames: homeTeam.records?.[2]?.summary || 'N/A',
                    ...homeStats
                },
                awayTeam: {
                    id: awayTeam.team.id,
                    name: awayTeam.team.name,
                    abbreviation: awayTeam.team.abbreviation,
                    logo: awayLogo,
                    homeRecord: awayTeam.records?.[0]?.summary || '0-0',
                    awayRecord: awayTeam.records?.[1]?.summary || '0-0',
                    lastFiveGames: awayTeam.records?.[2]?.summary || 'N/A',
                    ...awayStats
                }
            };
        }));

        console.log('Final processed matchups:', matchups);
        return matchups;

    } catch (error) {
        console.error('Error fetching matchups:', error);
        return mockMatchups;
    }
};

// New function to fetch team stats
const fetchTeamStats = async (teamId) => {
    try {
        const response = await axios.get(`${ESPN_API_BASE}/teams/${teamId}/statistics`);
        console.log(`Raw stats for team ${teamId}:`, response.data);

        const stats = response.data?.results?.stats || [];
        const opponentStats = response.data?.results?.opponent || [];

        // Get stats using exact array indices
        const passingStats = stats?.categories?.[0]?.stats || []; // Passing category
        const rushingStats = stats?.categories?.[1]?.stats || []; // Rushing category

        return {
            // Passing stats
            passYards: parseFloat(passingStats[14]?.value || '0'),

            // Rushing stats
            rushYards: parseFloat(rushingStats[1]?.value || '0'),

            // Calculate offensive yards (passing + rushing)
            offensiveYards: parseFloat(passingStats[14]?.value || '0') +
                parseFloat(rushingStats[1]?.value || '0'),

            // Points per game from total points
            pointsPerGame: parseFloat(passingStats[19]?.value || '0'),

            // Defensive stats from opponent section
            passYardsAllowed: parseFloat(opponentStats[0]?.stats?.[5]?.value || '0'),
            rushYardsAllowed: parseFloat(opponentStats[1]?.stats?.[1]?.value || '0'),
            pointsAllowed: parseFloat(opponentStats[10]?.stats?.[7]?.value || '0'),
            // Calculate total defensive yards
            defensiveYards: parseFloat(opponentStats[0]?.stats?.[5]?.value || '0') +
                parseFloat(opponentStats[1]?.stats?.[1]?.value || '0'),

            // Games played
            gamesPlayed: parseFloat(passingStats[16]?.value || '0'),

            // Points stats
            totalPoints: parseFloat(passingStats[19]?.value || '0'), // Total points
            pointsPerGame: parseFloat(passingStats[19]?.value || '0') / parseFloat(passingStats[16]?.value || '1'), // Points per game

            totalPointsAllowed: parseFloat(opponentStats[10]?.stats?.[7]?.value || '0'), // Total points allowed
            pointsAllowed: parseFloat(opponentStats[10]?.stats?.[7]?.value || '0') / parseFloat(passingStats[16]?.value || '1'), // Points allowed per game

            // ... rest of the stats
        };
    } catch (error) {
        console.error(`Error fetching stats for team ${teamId}:`, error);
        return {
            offensiveYards: 0,
            passYards: 0,
            rushYards: 0,
            pointsPerGame: 0,
            defensiveYards: 0,
            passYardsAllowed: 0,
            rushYardsAllowed: 0,
            pointsAllowed: 0,
            gamesPlayed: 0,
            totalPoints: 0,
            pointsPerGame: 0,
            totalPointsAllowed: 0,
            pointsAllowed: 0
        };
    }
};

// Comment out unused functions but keep them for later
/*
const handleApiError = (error) => {
    // Implementation
};

const transformTeamData = (data) => {
    // Implementation
};

const transformScheduleData = (data) => {
    // Implementation
};
*/

// New function to fetch all NFL teams with their stats
const getAllTeams = async () => {
    try {
        // First get all teams
        const teamsResponse = await axios.get(`${ESPN_API_BASE}/teams`);

        if (!teamsResponse.data?.sports?.[0]?.leagues?.[0]?.teams) {
            console.error('Invalid teams response structure:', teamsResponse.data);
            return mockTeams;
        }

        const teams = await Promise.all(
            teamsResponse.data.sports[0].leagues[0].teams.map(async ({ team }) => {
                try {
                    // Use the existing fetchTeamStats function since it already handles the API structure
                    const stats = await fetchTeamStats(team.id);

                    return {
                        id: team.id,
                        name: team.displayName,
                        abbreviation: team.abbreviation,
                        logo: team.logos?.[0]?.href,
                        ...stats
                    };
                } catch (error) {
                    console.error(`Error fetching stats for team ${team.id}:`, error);
                    return null;
                }
            })
        );

        // Filter out any null values and ensure we have all teams
        const validTeams = teams.filter(team => team !== null);

        if (validTeams.length === 32) {
            return validTeams;
        } else {
            console.warn(`Expected 32 teams but got ${validTeams.length}, using mock data`);
            return mockTeams;
        }
    } catch (error) {
        console.error('Error in getAllTeams:', error);
        return mockTeams;
    }
};

export const nflService = {
    getWeeklyMatchups,
    getAllTeams
};
