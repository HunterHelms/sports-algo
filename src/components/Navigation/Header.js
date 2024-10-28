import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    return (
        <nav className="bg-gray-800 text-white shadow-lg mb-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold">
                            NFL Matchup Insights
                        </Link>
                        <div className="flex space-x-4">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md ${location.pathname === '/'
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                Matchups
                            </Link>
                            <Link
                                to="/rankings"
                                className={`px-3 py-2 rounded-md ${location.pathname === '/rankings'
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                Rankings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
