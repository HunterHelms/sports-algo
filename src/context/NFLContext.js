import React, { createContext, useState, useContext, useEffect } from 'react';
import { nflService } from '../services/nflService';
import db from '../db/database';

export const NFLContext = createContext();

export const NFLProvider = ({ children }) => {
    const [matchups, setMatchups] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(8);
    const [predictions, setPredictions] = useState([]);

    // Load predictions from IndexedDB when component mounts
    useEffect(() => {
        const loadPredictions = async () => {
            try {
                const savedPredictions = await db.predictions.toArray();
                setPredictions(savedPredictions);
            } catch (err) {
                console.error('Error loading predictions:', err);
            }
        };
        loadPredictions();
    }, []);

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

    const value = {
        matchups,
        allTeams,
        loading,
        error,
        selectedWeek,
        setSelectedWeek,
        predictions,
        setPredictions
    };

    return (
        <NFLContext.Provider value={value}>
            {children}
        </NFLContext.Provider>
    );
};

export const useNFL = () => useContext(NFLContext);
