import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TeamStats = ({ team }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{team.name}</h2>
                <div className="flex gap-4 text-sm text-gray-600">
                    <span>Home: {team.homeRecord}</span>
                    <span>Away: {team.awayRecord}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Offense</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-500">Total Yards/Game</p>
                            <p className="text-xl font-bold">{team.offensiveYards?.toFixed(1) || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-500">Pass Yards/Game</p>
                            <p className="text-xl font-bold">{team.passYards?.toFixed(1) || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-500">Rush Yards/Game</p>
                            <p className="text-xl font-bold">{team.rushYards?.toFixed(1) || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-500">Points/Game</p>
                            <p className="text-xl font-bold">{team.pointsPerGame?.toFixed(1) || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Defense</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-500">Points Allowed</p>
                            <p className="text-xl font-bold">{team.pointsAllowed}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="text-gray-500">Yards Allowed</p>
                            <p className="text-xl font-bold">{team.yardsAllowed}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="performance-trends">
                <h3>Last 5 Games Performance</h3>
                <BarChart width={600} height={300} data={team.lastFiveGames}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="opponent" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pointsScored" fill="#8884d8" name="Points Scored" />
                    <Bar dataKey="pointsAllowed" fill="#82ca9d" name="Points Allowed" />
                </BarChart>
            </div>
        </div>
    );
};

export default TeamStats;
