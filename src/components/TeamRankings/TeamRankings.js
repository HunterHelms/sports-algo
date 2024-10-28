import React, { useState, useEffect } from 'react';
import { useNFL } from '../../context/NFLContext';
import LoadingSpinner from '../common/LoadingSpinner';

const TeamRankings = () => {
    const { allTeams, loading, error } = useNFL();
    const [activeTab, setActiveTab] = useState('offense');
    const [sortConfig, setSortConfig] = useState({
        key: 'yardsPerGame',
        direction: 'desc'
    });

    // Update sort configuration when tab changes
    useEffect(() => {
        setSortConfig({
            key: 'yardsPerGame',
            direction: activeTab === 'defense' ? 'asc' : 'desc' // ascending for defense (less yards is better)
        });
    }, [activeTab]);

    if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'desc'
                    ? 'asc'
                    : 'desc'
        }));
    };

    const getSortedTeams = () => {
        const teams = [...allTeams];
        return teams.sort((a, b) => {
            let aValue, bValue;

            // Define how to get values for each sortable column
            switch (sortConfig.key) {
                case 'gamesPlayed':
                    aValue = a.gamesPlayed;
                    bValue = b.gamesPlayed;
                    break;
                case 'totalYards':
                    aValue = activeTab === 'offense' ? a.offensiveYards : a.defensiveYards;
                    bValue = activeTab === 'offense' ? b.offensiveYards : b.defensiveYards;
                    break;
                case 'yardsPerGame':
                    aValue = (activeTab === 'offense' ? a.offensiveYards : a.defensiveYards) / a.gamesPlayed;
                    bValue = (activeTab === 'offense' ? b.offensiveYards : b.defensiveYards) / b.gamesPlayed;
                    break;
                case 'totalPass':
                    aValue = activeTab === 'offense' ? a.passYards : a.passYardsAllowed;
                    bValue = activeTab === 'offense' ? b.passYards : b.passYardsAllowed;
                    break;
                case 'passPerGame':
                    aValue = (activeTab === 'offense' ? a.passYards : a.passYardsAllowed) / a.gamesPlayed;
                    bValue = (activeTab === 'offense' ? b.passYards : b.passYardsAllowed) / b.gamesPlayed;
                    break;
                case 'totalRush':
                    aValue = activeTab === 'offense' ? a.rushYards : a.rushYardsAllowed;
                    bValue = activeTab === 'offense' ? b.rushYards : b.rushYardsAllowed;
                    break;
                case 'rushPerGame':
                    aValue = (activeTab === 'offense' ? a.rushYards : a.rushYardsAllowed) / a.gamesPlayed;
                    bValue = (activeTab === 'offense' ? b.rushYards : b.rushYardsAllowed) / b.gamesPlayed;
                    break;
                case 'totalPoints':
                    aValue = activeTab === 'offense' ? a.totalPoints : a.totalPointsAllowed;
                    bValue = activeTab === 'offense' ? b.totalPoints : b.totalPointsAllowed;
                    break;
                case 'pointsPerGame':
                    aValue = (activeTab === 'offense' ? a.totalPoints : a.totalPointsAllowed) / a.gamesPlayed;
                    bValue = (activeTab === 'offense' ? b.totalPoints : b.totalPointsAllowed) / b.gamesPlayed;
                    break;
                default:
                    return 0;
            }

            if (sortConfig.direction === 'asc') {
                return aValue - bValue;
            }
            return bValue - aValue;
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'desc' ? '↓' : '↑';
    };

    const renderHeaderCell = (label, sortKey) => (
        <th
            className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort(sortKey)}
        >
            <div className="flex items-center justify-end gap-1">
                {label}
                <span className="text-gray-500">{getSortIcon(sortKey)}</span>
            </div>
        </th>
    );

    const renderTeamRow = (team, index) => (
        <tr key={team.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 text-center">{index + 1}</td>
            <td className="px-4 py-2">
                <div className="flex items-center">
                    {team.logo && (
                        <img
                            src={team.logo}
                            alt={`${team.name} logo`}
                            className="w-8 h-8 mr-2"
                        />
                    )}
                    <span>{team.name}</span>
                </div>
            </td>
            <td className="px-4 py-2 text-right">{team.gamesPlayed || 0}</td>
            <td className="px-4 py-2 text-right">
                {(activeTab === 'offense' ? team.offensiveYards : team.defensiveYards)?.toFixed(1)}
            </td>
            <td className="px-4 py-2 text-right">
                {((activeTab === 'offense' ? team.offensiveYards : team.defensiveYards) / team.gamesPlayed)?.toFixed(1)}
            </td>
            <td className="px-4 py-2 text-right">
                {(activeTab === 'offense' ? team.passYards : team.passYardsAllowed)?.toFixed(1)}
            </td>
            <td className="px-4 py-2 text-right">
                {((activeTab === 'offense' ? team.passYards : team.passYardsAllowed) / team.gamesPlayed)?.toFixed(1)}
            </td>
            <td className="px-4 py-2 text-right">
                {(activeTab === 'offense' ? team.rushYards : team.rushYardsAllowed)?.toFixed(1)}
            </td>
            <td className="px-4 py-2 text-right">
                {((activeTab === 'offense' ? team.rushYards : team.rushYardsAllowed) / team.gamesPlayed)?.toFixed(1)}
            </td>
            <td className="px-4 py-2 text-right">
                {(activeTab === 'offense' ? team.totalPoints : team.totalPointsAllowed)?.toFixed(1)}
            </td>
            <td className="px-4 py-2 text-right">
                {((activeTab === 'offense' ? team.totalPoints : team.totalPointsAllowed) / team.gamesPlayed)?.toFixed(1)}
            </td>
        </tr>
    );

    const exportToCSV = () => {
        const teams = getSortedTeams();
        const headers = [
            'Rank',
            'Team',
            'Games Played',
            'Total Yards',
            'Yards/Game',
            'Pass Yards',
            'Pass Yards/Game',
            'Rush Yards',
            'Rush Yards/Game',
            'Points',
            'Points/Game'
        ];

        const csvData = teams.map((team, index) => [
            index + 1,
            team.name,
            team.gamesPlayed || 0,
            (activeTab === 'offense' ? team.offensiveYards : team.defensiveYards)?.toFixed(1),
            ((activeTab === 'offense' ? team.offensiveYards : team.defensiveYards) / team.gamesPlayed)?.toFixed(1),
            (activeTab === 'offense' ? team.passYards : team.passYardsAllowed)?.toFixed(1),
            ((activeTab === 'offense' ? team.passYards : team.passYardsAllowed) / team.gamesPlayed)?.toFixed(1),
            (activeTab === 'offense' ? team.rushYards : team.rushYardsAllowed)?.toFixed(1),
            ((activeTab === 'offense' ? team.rushYards : team.rushYardsAllowed) / team.gamesPlayed)?.toFixed(1),
            (activeTab === 'offense' ? team.totalPoints : team.totalPointsAllowed)?.toFixed(1),
            ((activeTab === 'offense' ? team.totalPoints : team.totalPointsAllowed) / team.gamesPlayed)?.toFixed(1)
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `nfl-${activeTab}-rankings.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">NFL Team Rankings</h1>
                <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    Export CSV
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === 'offense'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('offense')}
                >
                    Offensive Rankings
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === 'defense'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('defense')}
                >
                    Defensive Rankings
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-sm rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Rank</th>
                            <th className="px-4 py-3 text-left">Team</th>
                            {renderHeaderCell('GP', 'gamesPlayed')}
                            {renderHeaderCell('YDS', 'totalYards')}
                            {renderHeaderCell('YDS/G', 'yardsPerGame')}
                            {renderHeaderCell('PASS', 'totalPass')}
                            {renderHeaderCell('PASS/G', 'passPerGame')}
                            {renderHeaderCell('RUSH', 'totalRush')}
                            {renderHeaderCell('RUSH/G', 'rushPerGame')}
                            {renderHeaderCell('PTS', 'totalPoints')}
                            {renderHeaderCell('PTS/G', 'pointsPerGame')}
                        </tr>
                    </thead>
                    <tbody>
                        {getSortedTeams().map((team, index) => renderTeamRow(team, index))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamRankings;
