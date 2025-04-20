import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="home-container">
      <div className="floating-circle" />
      <div className="floating-circle" />
      <div className="floating-circle" />
      <h1 className="welcome-text">Welcome to the Digital-Self Expression Quiz!</h1>
      <button className="start-button" onClick={handleStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
};

export default HomePage; 