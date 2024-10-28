import db from '../db/database';

const calculatePrediction = (homeTeam, awayTeam) => {
    // Enhanced weight factors
    const weights = {
        offenseWeight: 0.25,
        defenseWeight: 0.35,
        pointsScoredWeight: 0.15,
        pointsAllowedWeight: 0.25,
        homeFieldAdvantage: 1.5,
        recentFormWeight: 0.2,
        rushingWeight: 0.05,
        passingWeight: 0.05
    };

    // Parse recent form (e.g., "3-2" to winning percentage)
    const getRecentFormScore = (record) => {
        const [wins, losses] = record.split('-').map(Number);
        return wins / (wins + losses) || 0;
    };

    // Calculate offensive efficiency (points per yard)
    const homeOffensiveEfficiency = homeTeam.pointsPerGame / (homeTeam.offensiveYards / homeTeam.gamesPlayed);
    const awayOffensiveEfficiency = awayTeam.pointsPerGame / (awayTeam.offensiveYards / awayTeam.gamesPlayed);

    // Calculate defensive efficiency (points allowed per yard)
    const homeDefensiveEfficiency = homeTeam.pointsAllowed / (homeTeam.defensiveYards / homeTeam.gamesPlayed);
    const awayDefensiveEfficiency = awayTeam.pointsAllowed / (awayTeam.defensiveYards / awayTeam.gamesPlayed);

    // Calculate balanced offensive strength
    const homeOffensiveStrength = (
        (homeTeam.offensiveYards / homeTeam.gamesPlayed * weights.offenseWeight) +
        (homeTeam.pointsPerGame * weights.pointsScoredWeight) +
        (homeTeam.rushYards * weights.rushingWeight) +
        (homeTeam.passYards * weights.passingWeight) +
        (getRecentFormScore(homeTeam.lastFiveGames) * weights.recentFormWeight * 10) +
        (homeOffensiveEfficiency * 5)
    );

    const awayOffensiveStrength = (
        (awayTeam.offensiveYards / awayTeam.gamesPlayed * weights.offenseWeight) +
        (awayTeam.pointsPerGame * weights.pointsScoredWeight) +
        (awayTeam.rushYards * weights.rushingWeight) +
        (awayTeam.passYards * weights.passingWeight) +
        (getRecentFormScore(awayTeam.lastFiveGames) * weights.recentFormWeight * 10) +
        (awayOffensiveEfficiency * 5)
    );

    // Calculate balanced defensive strength
    const homeDefensiveStrength = (
        (homeTeam.defensiveYards / homeTeam.gamesPlayed * weights.defenseWeight) +
        (homeTeam.pointsAllowed * weights.pointsAllowedWeight) +
        (homeDefensiveEfficiency * 5)
    );

    const awayDefensiveStrength = (
        (awayTeam.defensiveYards / awayTeam.gamesPlayed * weights.defenseWeight) +
        (awayTeam.pointsAllowed * weights.pointsAllowedWeight) +
        (awayDefensiveEfficiency * 5)
    );

    // Calculate base scores with more variance
    let homePredictedScore = normalizeScore(
        ((homeOffensiveStrength - awayDefensiveStrength) + weights.homeFieldAdvantage),
        homeOffensiveStrength
    );

    let awayPredictedScore = normalizeScore(
        (awayOffensiveStrength - homeDefensiveStrength),
        awayOffensiveStrength
    );

    return {
        homePredictedScore,
        awayPredictedScore,
        confidence: calculateConfidence(homeOffensiveStrength, awayOffensiveStrength,
            homeDefensiveStrength, awayDefensiveStrength)
    };
};

// Helper function to normalize scores to realistic NFL ranges
const normalizeScore = (score, offensiveStrength) => {
    // Base score calculation using team's offensive strength
    let normalizedScore = Math.max(3, Math.round(score * (offensiveStrength / 100)));

    // Ensure minimum score of 3
    normalizedScore = Math.max(3, normalizedScore);

    // Add variance based on offensive strength
    const varianceFactor = Math.random() * (offensiveStrength / 100);
    normalizedScore += Math.round(varianceFactor * 14); // Up to 14 points of variance

    // Add touchdown probability (higher for stronger offenses)
    if (Math.random() < (offensiveStrength / 150)) {
        normalizedScore += 7;
    }

    // Add field goal probability
    if (Math.random() < 0.4) {
        normalizedScore += 3;
    }

    // Round to nearest field goal (3 points)
    normalizedScore = Math.round(normalizedScore / 3) * 3;

    // Cap maximum score at 45 (rare to see higher)
    return Math.min(normalizedScore, 45);
};

// Enhanced confidence calculation
const calculateConfidence = (homeOff, awayOff, homeDef, awayDef) => {
    // Calculate strength differences
    const offensiveDifference = Math.abs(homeOff - awayOff);
    const defensiveDifference = Math.abs(homeDef - awayDef);

    // Weight the differences (offense slightly more important)
    const weightedDifference = (offensiveDifference * 0.6) + (defensiveDifference * 0.4);

    // Base confidence calculation
    let confidence = Math.round(weightedDifference * 7);

    // Apply diminishing returns
    if (confidence > 70) {
        confidence = 70 + Math.round((confidence - 70) / 4);
    }

    // Cap at 99%
    return Math.min(confidence, 99);
};

export const predictionService = {
    async savePrediction(gameId, prediction) {
        try {
            await db.predictions.add({
                gameId,
                ...prediction,
                timestamp: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Error saving prediction:', error);
            return false;
        }
    },

    async getPrediction(gameId) {
        try {
            return await db.predictions
                .where('gameId')
                .equals(gameId)
                .first();
        } catch (error) {
            console.error('Error getting prediction:', error);
            return null;
        }
    },

    generatePrediction(homeTeam, awayTeam) {
        return calculatePrediction(homeTeam, awayTeam);
    }
};
