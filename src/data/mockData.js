export const mockTeams = [
    {
        id: "bal",
        name: "Ravens",
        logo: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png",
        offensiveYards: 425.3,
        defensiveYards: 280.4,
        yardsPerGame: 425.3,
        passYards: 275.3,
        rushYards: 150.0,
        pointsPerGame: 28.5,
        pointsAllowed: 17.8,
    },
    {
        id: "sf",
        name: "49ers",
        logo: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png",
        offensiveYards: 402.8,
        defensiveYards: 285.2,
        yardsPerGame: 402.8,
        passYards: 252.4,
        rushYards: 150.4,
        pointsPerGame: 29.2,
        pointsAllowed: 15.5,
    },
    // Add all 32 teams with mock data...
    {
        id: "buf",
        name: "Bills",
        logo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
        offensiveYards: 385.6,
        defensiveYards: 310.5,
        yardsPerGame: 385.6,
        passYards: 245.8,
        rushYards: 139.8,
        pointsPerGame: 26.8,
        pointsAllowed: 20.4,
    },
    // ... continue with all NFL teams
];

export const mockMatchups = [
    {
        id: 1,
        week: 8,
        homeTeam: mockTeams[0],
        awayTeam: mockTeams[1]
    }
];

// Add these helper functions
export const getAdvantageClass = (value1, value2) => {
    if (Math.abs(value1 - value2) <= 0.5) return 'text-gray-500';
    return value1 > value2 ? 'text-green-600' : 'text-red-600';
};

export const formatLastFive = (results) => {
    return results.map((result, index) => (
        <span
            key={index}
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                 ${result === 'W' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} 
                 text-xs font-medium mx-0.5`}
        >
            {result}
        </span>
    ));
};
