import React from 'react';
import { useNFL } from '../../context/NFLContext';
import { MatchupCard } from '../MatchupCard/MatchupCard';
import WeekSelector from '../WeekSelector/WeekSelector';

const MatchupsContainer = () => {
    const { matchups, loading, error } = useNFL();

    if (loading) return <div className="loading">Loading matchups...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!matchups?.length) return <div className="no-matchups">No matchups found for this week</div>;

    return (
        <div>
            <div className="mb-8">
                <WeekSelector />
            </div>
            <div className="matchups-container">
                {matchups.map(matchup => (
                    <MatchupCard
                        key={matchup.id}
                        homeTeam={matchup.homeTeam}
                        awayTeam={matchup.awayTeam}
                        gameStatus={matchup.gameStatus}
                        gameDate={matchup.gameDate}
                        homeScore={matchup.homeScore}
                        awayScore={matchup.awayScore}
                    />
                ))}
            </div>
        </div>
    );
};

export default MatchupsContainer;
