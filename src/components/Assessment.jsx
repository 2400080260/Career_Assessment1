import { useState } from 'react'
import '../styles/Assessment.css'

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    category: 'Technical Skills',
    question: 'How comfortable are you with technical concepts and coding?',
    options: [
      { text: 'Very comfortable, love building software', careers: { 'Software Developer': 100 } },
      { text: 'Comfortable with basics', careers: { 'Civil Engineer': 80, 'Software Developer': 40 } },
      { text: 'Prefer creative over technical', careers: { 'Graphic Designer': 90, 'Doctor': 30 } },
      { text: 'Numbers and analysis appeal more', careers: { 'Chartered Accountant': 95, 'Doctor': 50 } }
    ]
  },
  {
    id: 2,
    category: 'Work Environment',
    question: 'What type of work environment appeals to you most?',
    options: [
      { text: 'Modern tech company with innovation focus', careers: { 'Software Developer': 95 } },
      { text: 'Hospital or healthcare setting', careers: { 'Doctor': 100 } },
      { text: 'Corporate office with structured environment', careers: { 'Chartered Accountant': 90, 'Software Developer': 50 } },
      { text: 'Creative studio with artistic freedom', careers: { 'Graphic Designer': 95 } }
    ]
  },
  {
    id: 3,
    category: 'Problem Solving',
    question: 'How do you prefer to solve problems?',
    options: [
      { text: 'Write code and test solutions', careers: { 'Software Developer': 95 } },
      { text: 'Diagnose and treat patients', careers: { 'Doctor': 100 } },
      { text: 'Design and build structures', careers: { 'Civil Engineer': 95 } },
      { text: 'Analyze numbers and financial data', careers: { 'Chartered Accountant': 90 } }
    ]
  },
  {
    id: 4,
    category: 'Creative Ability',
    question: 'How important is creativity in your ideal career?',
    options: [
      { text: 'Extremely important - visual design drives me', careers: { 'Graphic Designer': 100 } },
      { text: 'Very important for software solutions', careers: { 'Software Developer': 80 } },
      { text: 'Somewhat important for designs', careers: { 'Civil Engineer': 75 } },
      { text: 'Less important, accuracy is key', careers: { 'Chartered Accountant': 85, 'Doctor': 80 } }
    ]
  },
  {
    id: 5,
    category: 'People Interaction',
    question: 'How much direct human interaction do you want in your work?',
    options: [
      { text: 'Direct patient care is essential', careers: { 'Doctor': 100 } },
      { text: 'Client consulting and presentations', careers: { 'Chartered Accountant': 85 } },
      { text: 'Collaborating with team members', careers: { 'Software Developer': 70 } },
      { text: 'Minimal interaction, focus on work', careers: { 'Graphic Designer': 90 } }
    ]
  },
  {
    id: 6,
    category: 'Physical Work',
    question: 'Do you prefer physical or mental work?',
    options: [
      { text: 'Physical work on-site, building things', careers: { 'Civil Engineer': 100 } },
      { text: 'Mental work at computer', careers: { 'Software Developer': 95 } },
      { text: 'Mix of both - hands-on and creative', careers: { 'Graphic Designer': 75, 'Civil Engineer': 60 } },
      { text: 'Purely mental - analysis and thinking', careers: { 'Chartered Accountant': 90, 'Doctor': 80 } }
    ]
  },
  {
    id: 7,
    category: 'Impact & Purpose',
    question: 'What impact matters most to your career choice?',
    options: [
      { text: 'Saving lives and helping patients', careers: { 'Doctor': 100 } },
      { text: 'Building technology that changes the world', careers: { 'Software Developer': 95 } },
      { text: 'Creating infrastructure and buildings', careers: { 'Civil Engineer': 90 } },
      { text: 'Creating beautiful visual experiences', careers: { 'Graphic Designer': 95 } }
    ]
  },
  {
    id: 8,
    category: 'Financial Management',
    question: 'How interested are you in financial matters?',
    options: [
      { text: 'Extremely interested in numbers and finances', careers: { 'Chartered Accountant': 100 } },
      { text: 'Interested but not primary focus', careers: { 'Doctor': 50 } },
      { text: 'Interested in tech business side', careers: { 'Software Developer': 60, 'Chartered Accountant': 50 } },
      { text: 'Concerned about project budgets', careers: { 'Civil Engineer': 70 } }
    ]
  }
]

export default function Assessment({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [scores, setScores] = useState({})

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers, selectedOption.text]
    setAnswers(newAnswers)

    const newScores = { ...scores }
    Object.entries(selectedOption.careers).forEach(([career, score]) => {
      newScores[career] = (newScores[career] || 0) + score
    })
    setScores(newScores)

    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onComplete(newScores)
    }
  }

  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100

  return (
    <div className="assessment-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-text">Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</div>

      <div className="question-card">
        <h2>{ASSESSMENT_QUESTIONS[currentQuestion].question}</h2>
        <div className="category-badge">{ASSESSMENT_QUESTIONS[currentQuestion].category}</div>

        <div className="options">
          {ASSESSMENT_QUESTIONS[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              className="option-button"
              onClick={() => handleAnswer(option)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
