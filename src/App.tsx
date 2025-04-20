import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import './App.css';
import ConclusionPage from './components/ConclusionPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/conclusion" element={<ConclusionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
