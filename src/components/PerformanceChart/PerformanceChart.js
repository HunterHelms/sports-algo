import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const PerformanceChart = ({ homeTeam, awayTeam }) => {
    // Combine the performance data for both teams
    const chartData = homeTeam.performanceData?.map((data, index) => ({
        week: `Week ${data.week}`,
        [homeTeam.name]: data.points,
        [awayTeam.name]: awayTeam.performanceData?.[index]?.points
    })) || [];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Points Scored Per Week</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={homeTeam.name}
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey={awayTeam.name}
                            stroke="#82ca9d"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformanceChart;
