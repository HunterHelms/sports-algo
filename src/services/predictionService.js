import db from '../db/database';

const calculatePrediction = (homeTeam, awayTeam) => {
    // Ensure we have valid team data
    if (!homeTeam || !awayTeam) {
        console.error('Missing team data in prediction calculation');
        return {
            homePredictedScore: 24,
            awayPredictedScore: 21,
            confidence: 50
        };
    }

    const weights = {
        offenseWeight: 0.4,
        defenseWeight: 0.4,
        pointsScoredWeight: 0.1,
        pointsAllowedWeight: 0.1,
        homeFieldAdvantage: 2.5
    };

    // Calculate strengths with null checks
    const homeOffensiveStrength = (
        ((homeTeam.offensiveYards || 0) / (homeTeam.gamesPlayed || 1) * weights.offenseWeight) +
        ((homeTeam.pointsPerGame || 0) * weights.pointsScoredWeight)
    );

    const awayOffensiveStrength = (
        ((awayTeam.offensiveYards || 0) / (awayTeam.gamesPlayed || 1) * weights.offenseWeight) +
        ((awayTeam.pointsPerGame || 0) * weights.pointsScoredWeight)
    );

    const homeDefensiveStrength = (
        ((homeTeam.defensiveYards || 0) / (homeTeam.gamesPlayed || 1) * weights.defenseWeight) +
        ((homeTeam.pointsAllowed || 0) * weights.pointsAllowedWeight)
    );

    const awayDefensiveStrength = (
        ((awayTeam.defensiveYards || 0) / (awayTeam.gamesPlayed || 1) * weights.defenseWeight) +
        ((awayTeam.pointsAllowed || 0) * weights.pointsAllowedWeight)
    );

    // Generate scores
    const homePredictedScore = normalizeScore(
        homeOffensiveStrength + weights.homeFieldAdvantage,
        homeOffensiveStrength,
        awayDefensiveStrength
    );

    const awayPredictedScore = normalizeScore(
        awayOffensiveStrength,
        awayOffensiveStrength,
        homeDefensiveStrength
    );

    return {
        homePredictedScore,
        awayPredictedScore,
        confidence: calculateConfidence(
            homeOffensiveStrength,
            awayOffensiveStrength,
            homeDefensiveStrength,
            awayDefensiveStrength
        )
    };
};

// Helper function to normalize scores to realistic NFL ranges
const normalizeScore = (score, offensiveStrength, defensiveStrength) => {
    // Calculate base score using both offensive and defensive strengths
    const strengthRatio = offensiveStrength / defensiveStrength;

    // Common NFL scores weighted by frequency (expanded to include higher scores)
    const commonScores = [
        // Lower scores
        { score: 13, weight: 0.08 }, // FG + TD
        { score: 14, weight: 0.08 }, // 2 TD
        { score: 17, weight: 0.12 }, // 2 TD + FG
        { score: 20, weight: 0.12 }, // 2 TD + 2 FG
        { score: 21, weight: 0.10 }, // 3 TD
        { score: 24, weight: 0.10 }, // 3 TD + FG
        { score: 27, weight: 0.08 }, // 3 TD + 2 FG
        { score: 28, weight: 0.08 }, // 4 TD
        // Mid-range scores
        { score: 31, weight: 0.06 }, // 4 TD + FG
        { score: 34, weight: 0.05 }, // 4 TD + 2 FG
        { score: 35, weight: 0.04 }, // 5 TD
        { score: 38, weight: 0.03 }, // 5 TD + FG
        // High scores (less common)
        { score: 41, weight: 0.02 }, // 5 TD + 2 FG
        { score: 42, weight: 0.01 }, // 6 TD
        { score: 45, weight: 0.01 }, // 6 TD + FG
        { score: 48, weight: 0.008 }, // 6 TD + 2 FG
        { score: 49, weight: 0.006 }, // 7 TD
        { score: 52, weight: 0.004 }, // 7 TD + FG
        { score: 55, weight: 0.003 }, // 7 TD + 2 FG
        { score: 56, weight: 0.002 }, // 8 TD
        // Extreme scores (very rare)
        { score: 63, weight: 0.001 }, // 9 TD
        { score: 70, weight: 0.0005 }, // 10 TD
        { score: 72, weight: 0.0005 }  // 10 TD + FG
    ];

    // Adjust score ranges based on team strength
    let possibleScores;

    if (strengthRatio > 1.3) { // Very strong offense vs weak defense
        possibleScores = commonScores.filter(s => s.score >= 28);
    } else if (strengthRatio > 1.1) { // Strong offense vs weak defense
        possibleScores = commonScores.filter(s => s.score >= 21 && s.score <= 49);
    } else if (strengthRatio < 0.7) { // Very weak offense vs strong defense
        possibleScores = commonScores.filter(s => s.score <= 21);
    } else if (strengthRatio < 0.9) { // Weak offense vs strong defense
        possibleScores = commonScores.filter(s => s.score <= 28);
    } else { // Balanced matchup
        possibleScores = commonScores.filter(s => s.score >= 14 && s.score <= 35);
    }

    // Random selection weighted by probability
    const totalWeight = possibleScores.reduce((sum, score) => sum + score.weight, 0);
    let random = Math.random() * totalWeight;

    for (const scoreObj of possibleScores) {
        random -= scoreObj.weight;
        if (random <= 0) {
            return scoreObj.score;
        }
    }

    // Fallback to a common score if something goes wrong
    return 24;
};

// Enhanced confidence calculation
const calculateConfidence = (homeOff, awayOff, homeDef, awayDef) => {
    // Add console.log to debug input values
    console.log('Confidence Calculation Inputs:', {
        homeOff,
        awayOff,
        homeDef,
        awayDef
    });

    // Ensure we have valid numbers
    if (!homeOff || !awayOff || !homeDef || !awayDef) {
        console.error('Missing values in confidence calculation');
        return 50; // Default to 50% if we're missing data
    }

    // Calculate strength differences
    const offensiveDifference = Math.abs(homeOff - awayOff) || 0;
    const defensiveDifference = Math.abs(homeDef - awayDef) || 0;

    // Weight the differences (offense slightly more important)
    const weightedDifference = (offensiveDifference * 0.6) + (defensiveDifference * 0.4);

    // Base confidence calculation
    let confidence = Math.round(weightedDifference * 7);

    // Apply diminishing returns
    if (confidence > 70) {
        confidence = 70 + Math.round((confidence - 70) / 4);
    }

    // Ensure confidence is between 1 and 99
    confidence = Math.min(Math.max(1, confidence), 99);

    // Log final confidence value
    console.log('Calculated Confidence:', confidence);

    return confidence;
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
