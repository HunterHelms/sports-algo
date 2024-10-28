import React from 'react';

export const MatchupCard = ({ homeTeam, awayTeam, gameStatus, gameDate, homeScore, awayScore }) => {
    console.log('MatchupCard Props:', { homeTeam, awayTeam, gameStatus, gameDate, homeScore, awayScore });

    if (!homeTeam || !awayTeam) {
        console.log('Missing team data');
        return <div className="p-4 bg-red-100 text-red-700 rounded-lg">Missing team data</div>;
    }

    const renderGameStatus = () => {
        if (gameStatus === 'STATUS_FINAL') {
            return (
                <div className="text-center mb-4">
                    <span className="text-sm font-medium text-gray-500">Final</span>
                    <div className="text-3xl font-bold text-gray-800 mt-2">
                        {homeScore} - {awayScore}
                    </div>
                </div>
            );
        } else if (gameStatus === 'STATUS_SCHEDULED') {
            return (
                <div className="text-center mb-4">
                    <span className="text-sm font-medium text-gray-500">
                        {new Date(gameDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            timeZoneName: 'short'
                        })}
                    </span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {renderGameStatus()}
            <div className="grid grid-cols-3 gap-6 items-center mb-6">
                <div className="text-center">
                    <div className="flex flex-col items-center mb-4">
                        {homeTeam.logo && (
                            <img
                                src={homeTeam.logo}
                                alt={`${homeTeam.name} logo`}
                                className="w-20 h-20 object-contain mb-2"
                            />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">{homeTeam.name}</h2>
                    </div>
                    <div className="space-y-2 text-gray-600">
                        <p>Home Record: <span className="font-semibold">{homeTeam.homeRecord}</span></p>
                        <p>Last 5 Games: <span className="font-semibold">{homeTeam.lastFiveGames}</span></p>
                        <p>Offensive Yards/Game: <span className="font-semibold">
                            {homeTeam.offensiveYards ? homeTeam.offensiveYards.toFixed(1) : 'N/A'}
                        </span></p>
                        <p>Defensive Yards Allowed: <span className="font-semibold">
                            {homeTeam.defensiveYards ? homeTeam.defensiveYards.toFixed(1) : 'N/A'}
                        </span></p>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-500">VS</span>
                </div>

                <div className="text-center">
                    <div className="flex flex-col items-center mb-4">
                        {awayTeam.logo && (
                            <img
                                src={awayTeam.logo}
                                alt={`${awayTeam.name} logo`}
                                className="w-20 h-20 object-contain mb-2"
                            />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">{awayTeam.name}</h2>
                    </div>
                    <div className="space-y-2 text-gray-600">
                        <p>Away Record: <span className="font-semibold">{awayTeam.awayRecord}</span></p>
                        <p>Last 5 Games: <span className="font-semibold">{awayTeam.lastFiveGames}</span></p>
                        <p>Offensive Yards/Game: <span className="font-semibold">
                            {awayTeam.offensiveYards ? awayTeam.offensiveYards.toFixed(1) : 'N/A'}
                        </span></p>
                        <p>Defensive Yards Allowed: <span className="font-semibold">
                            {awayTeam.defensiveYards ? awayTeam.defensiveYards.toFixed(1) : 'N/A'}
                        </span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchupCard;
