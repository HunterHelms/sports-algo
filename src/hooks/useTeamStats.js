import { useState, useEffect } from 'react';
import { nflService } from '../services/nflService';

export const useTeamStats = (teamId) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await nflService.getTeamStats(teamId);
                setStats(data);
            } catch (err) {
                setError('Failed to fetch team stats');
            } finally {
                setLoading(false);
            }
        };

        if (teamId) {
            fetchStats();
        }
    }, [teamId]);

    return { stats, loading, error };
};

