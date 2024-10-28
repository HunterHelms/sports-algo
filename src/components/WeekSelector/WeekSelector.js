import React from 'react';
import { useNFL } from '../../context/NFLContext';
import './WeekSelector.css';

const WeekSelector = () => {
    const { selectedWeek, setSelectedWeek } = useNFL();

    return (
        <div className="flex items-center justify-center gap-4">
            <label
                htmlFor="week-select"
                className="text-gray-700 font-medium"
            >
                Select Week:
            </label>
            <select
                id="week-select"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-white text-gray-900"
            >
                {Array.from({ length: 18 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        Week {i + 1}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default WeekSelector;
