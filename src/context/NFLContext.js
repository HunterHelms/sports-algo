import React, { createContext, useState, useContext, useEffect } from 'react';
import { nflService } from '../services/nflService';

export const NFLContext = createContext();

export const NFLProvider = ({ children }) => {
    const [matchups, setMatchups] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(8);

    // Separate effect for fetching teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teams = await nflService.getAllTeams();
                setAllTeams(teams);
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError(err.message);
            }
        };
        fetchTeams();
    }, []); // Only fetch teams once on mount

    // Separate effect for fetching matchups
    useEffect(() => {
        const fetchMatchups = async () => {
            try {
                setLoading(true);
                const data = await nflService.getWeeklyMatchups(selectedWeek);
                setMatchups(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching matchups:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatchups();
    }, [selectedWeek]);

    return (
        <NFLContext.Provider value={{
            matchups,
            allTeams,
            loading,
            error,
            selectedWeek,
            setSelectedWeek
        }}>
            {children}
        </NFLContext.Provider>
    );
};

export const useNFL = () => useContext(NFLContext);
