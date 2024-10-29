import React, { useState, useEffect } from 'react';
import { predictionService } from '../../services/predictionService';

const getGradeFromConfidence = (confidence) => {
    if (confidence >= 80) return { grade: 'A', color: 'text-green-600' };
    if (confidence >= 65) return { grade: 'B', color: 'text-green-500' };
    if (confidence >= 45) return { grade: 'C', color: 'text-yellow-500' };
    if (confidence >= 25) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
};

export const GamePrediction = ({ game }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrediction = async () => {
            try {
                console.log('Game data received:', game);

                const predictionId = `${game.week}-${game.id}`;

                const savedPrediction = await predictionService.getPrediction(predictionId);

                if (savedPrediction) {
                    console.log('Found saved prediction:', savedPrediction);
                    setPrediction(savedPrediction);
                } else {
                    console.log('Generating new prediction with team data:', {
                        homeTeam: game.homeTeam,
                        awayTeam: game.awayTeam
                    });

                    const newPrediction = predictionService.generatePrediction(
                        game.homeTeam,
                        game.awayTeam
                    );

                    await predictionService.savePrediction(predictionId, newPrediction);
                    console.log('New prediction generated:', newPrediction);
                    setPrediction(newPrediction);
                }
            } catch (error) {
                console.error('Error loading prediction:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPrediction();
    }, [game]);

    if (loading) {
        return <div>Loading prediction...</div>;
    }

    const { grade, color } = getGradeFromConfidence(prediction?.confidence || 0);

    return (
        <div className="bg-gray-50 rounded-lg shadow p-4 mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Prediction</h3>
            <div className="grid grid-cols-3 gap-4 items-center">
                {/* Home Team */}
                <div className="text-center">
                    <p className="font-bold text-gray-700">{game.homeTeam.name}</p>
                    <p className="text-3xl font-bold text-gray-800">
                        {prediction?.homePredictedScore}
                    </p>
                </div>

                {/* Confidence/Grade */}
                <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm">
                    <div className="mb-1">
                        <span className="text-sm text-gray-600">Confidence</span>
                        <p className="font-bold text-lg text-gray-800">
                            {prediction?.confidence}%
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Grade</span>
                        <p className={`font-bold text-2xl ${color}`}>
                            {grade}
                        </p>
                    </div>
                </div>

                {/* Away Team */}
                <div className="text-center">
                    <p className="font-bold text-gray-700">{game.awayTeam.name}</p>
                    <p className="text-3xl font-bold text-gray-800">
                        {prediction?.awayPredictedScore}
                    </p>
                </div>
            </div>

            {/* Winner Prediction */}
            <div className="text-center mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">Predicted Winner</p>
                <p className="font-bold text-gray-800">
                    {prediction?.homePredictedScore > prediction?.awayPredictedScore
                        ? game.homeTeam.name
                        : game.awayTeam.name}
                </p>
            </div>
        </div>
    );
};

