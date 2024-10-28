import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NFLProvider } from './context/NFLContext';
import Header from './components/Navigation/Header';
import TeamRankings from './components/TeamRankings/TeamRankings';
import MatchupsContainer from './components/MatchupsContainer/MatchupsContainer';
import './App.css';

const App = () => {
  return (
    <Router>
      <NFLProvider>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<MatchupsContainer />} />
              <Route path="/rankings" element={<TeamRankings />} />
            </Routes>
          </main>
        </div>
      </NFLProvider>
    </Router>
  );
};

export default App;
