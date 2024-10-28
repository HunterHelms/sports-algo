import React from 'react';

const ComparisonTable = ({ homeTeam, awayTeam }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{homeTeam.name}</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{awayTeam.name}</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Advantage</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {/* Offensive Comparisons */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Points/Game</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{homeTeam.pointsPerGame}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{awayTeam.pointsPerGame}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{getAdvantage(homeTeam.pointsPerGame, awayTeam.pointsPerGame)}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Yards/Game</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{homeTeam.yardsPerGame}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{awayTeam.yardsPerGame}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{getAdvantage(homeTeam.yardsPerGame, awayTeam.yardsPerGame)}</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pass Yards/Game</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{homeTeam.passYards}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{awayTeam.passYards}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{getAdvantage(homeTeam.passYards, awayTeam.passYards)}</td>
                    </tr>
                    {/* Defensive Comparisons */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Points Allowed/Game</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{homeTeam.pointsAllowed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{awayTeam.pointsAllowed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{getAdvantage(awayTeam.pointsAllowed, homeTeam.pointsAllowed)}</td>
                    </tr>
                    {/* Recent Form */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Last 5 Games</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{formatLastFive(homeTeam.lastFiveResults)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{formatLastFive(awayTeam.lastFiveResults)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">{compareLastFive(homeTeam.lastFiveResults, awayTeam.lastFiveResults)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// Helper functions
const getAdvantage = (home, away) => {
    const diff = home - away;
    if (Math.abs(diff) < 0.5) return "EVEN";
    return diff > 0 ? "HOME" : "AWAY";
};

const formatLastFive = (results) => {
    return results.map(result => result === 'W' ? '✅' : '❌').join(' ');
};

const compareLastFive = (homeResults, awayResults) => {
    const homeWins = homeResults.filter(r => r === 'W').length;
    const awayWins = awayResults.filter(r => r === 'W').length;
    if (Math.abs(homeWins - awayWins) <= 1) return "EVEN";
    return homeWins > awayWins ? "HOME" : "AWAY";
};

export default ComparisonTable;
