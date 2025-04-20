import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css';
import { questions } from '../data/quizData';
import { personas } from '../data/personaData';

interface PersonaScores {
  [persona: string]: number;
}

interface AnswerScores {
  [persona: string]: number;
}

interface QuestionScores {
  [answer: string]: AnswerScores;
}

interface ScoringMap {
  [questionId: string]: QuestionScores;
}

const scoringMap: ScoringMap = require('../Extended_Quiz_Persona_Scoring_Map.json');

const QuizPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({});
  const [personaScores, setPersonaScores] = useState<PersonaScores>(
    personas.reduce((acc, persona) => ({ ...acc, [persona.name]: 0 }), {})
  );
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isQuestion12AnsweredNo = currentQuestionIndex === 11 && selectedOptions[12]?.includes('No');

  const updatePersonaScores = (questionId: number, answers: string[]) => {
    const questionScores = scoringMap[questionId.toString()];
    if (!questionScores) return;

    setPersonaScores(prevScores => {
      const newScores = { ...prevScores };
      
      answers.forEach(answer => {
        const answerScores = questionScores[answer];
        if (answerScores) {
          Object.entries(answerScores).forEach(([persona, score]) => {
            newScores[persona] = (newScores[persona] || 0) + (score as number);
          });
        }
      });
      
      return newScores;
    });
  };

  const handleOptionSelect = (option: string) => {
    if (currentQuestion.allowMultiple) {
      setSelectedOptions(prev => ({
        ...prev,
        [currentQuestion.id]: prev[currentQuestion.id]?.includes(option)
          ? prev[currentQuestion.id].filter(o => o !== option)
          : [...(prev[currentQuestion.id] || []), option]
      }));
    } else {
      setSelectedOptions(prev => ({
        ...prev,
        [currentQuestion.id]: [option]
      }));
    }
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = selectedOptions[currentQuestion.id]?.[0];
    const currentAnswers = selectedOptions[currentQuestion.id] || [];

    // Update scores for current question
    updatePersonaScores(currentQuestion.id, currentAnswers);

    // Check for early conclusion conditions
    if (isLastQuestion) {
      navigate('/conclusion', { state: { personaScores } });
      return;
    }

    // Handle branching logic
    switch (currentQuestionIndex) {
      case 1: // After Q2 (Primary Use)
        if (currentAnswer === 'Consuming Content') {
          setCurrentQuestionIndex(7); // Skip to Q8
        } else {
          setCurrentQuestionIndex(2); // Continue to Q3
        }
        break;

      case 4: // After Q5 (Feedback Interest)
        if (currentAnswer === 'No') {
          setCurrentQuestionIndex(7); // Skip to Q8
        } else {
          setCurrentQuestionIndex(5); // Continue to Q6
        }
        break;

      case 9: // After Q10 (Content Sharing)
        if (currentAnswer === 'No') {
          setCurrentQuestionIndex(11); // Skip to Q12
        } else {
          setCurrentQuestionIndex(10); // Continue to Q11
        }
        break;

      case 11: // After Q12 (Profile Features Interest)
        if (currentAnswer === 'No') {
          navigate('/conclusion', { state: { personaScores } });
        } else {
          setCurrentQuestionIndex(12); // Continue to Q13
        }
        break;

      default:
        setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const hasSelectedOption = selectedOptions[currentQuestion.id]?.length > 0;

  return (
    <div className="quiz-page">
      <div className="floating-element" />
      <div className="floating-element" />
      <div className="floating-element" />
      
      <div className="quiz-container">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="question-container">
          <h2>{currentQuestion.text}</h2>
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`option ${selectedOptions[currentQuestion.id]?.includes(option) ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                {currentQuestion.allowMultiple ? (
                  <span className="checkbox">
                    {selectedOptions[currentQuestion.id]?.includes(option) ? '☑' : '☐'} {option}
                  </span>
                ) : option}
              </div>
            ))}
          </div>
        </div>
        <div className="navigation-buttons">
          <button 
            onClick={handleNext}
            disabled={!hasSelectedOption}
          >
            {isLastQuestion || isQuestion12AnsweredNo ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 