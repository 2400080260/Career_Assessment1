import { useState, useEffect } from 'react'
import { saveAssessmentResult, getUserAssessments } from '../api'
import '../styles/Results.css'

const CAREER_DETAILS = {
  'Software Developer': {
    title: 'Software Developer',
    description: 'Design, build, and maintain software applications. Create innovative solutions using programming languages and technologies. Work in a fast-paced tech environment solving complex technical challenges.',
    icon: '💻',
    skills: ['Programming', 'Problem Solving', 'Collaboration', 'Continuous Learning'],
    averageSalary: '₹25,00,000 - ₹80,00,000',
    jobOutlook: 'Excellent - Very High Demand in India'
  },
  'Doctor': {
    title: 'Doctor (Physician)',
    description: 'Diagnose and treat patients, improve their health and well-being. Work in hospitals, clinics, or private practice. Make a direct, meaningful impact on people\'s lives every single day.',
    icon: '⚕️',
    skills: ['Medical Knowledge', 'Patient Care', 'Decision Making', 'Empathy'],
    averageSalary: '₹25,00,000 - ₹100,00,000',
    jobOutlook: 'Strong - High Respect & Career Stability'
  },
  'Chartered Accountant': {
    title: 'Chartered Accountant (CA)',
    description: 'Manage financial records, audit accounts, and provide tax advice. Help businesses and individuals make sound financial decisions. Ensure compliance with accounting standards and regulations.',
    icon: '📊',
    skills: ['Financial Analysis', 'Attention to Detail', 'Auditing', 'Regulatory Knowledge'],
    averageSalary: '₹30,00,000 - ₹80,00,000',
    jobOutlook: 'Stable - Highly Valued Qualification in India'
  },
  'Civil Engineer': {
    title: 'Civil Engineer',
    description: 'Design and oversee construction of infrastructure projects like buildings, bridges, and roads. Work on large-scale projects that shape cities and improve public infrastructure. Combine technical knowledge with creative design.',
    icon: '🏗️',
    skills: ['Project Management', 'Technical Design', 'Problem Solving', 'CAD Software'],
    averageSalary: '₹25,00,000 - ₹75,00,000',
    jobOutlook: 'Good - Growing Infrastructure Development'
  },
  'Graphic Designer': {
    title: 'Graphic Designer',
    description: 'Create visual content for brands, websites, and marketing materials. Design everything from logos to complete brand identities. Express creativity while solving visual communication challenges.',
    icon: '🎨',
    skills: ['Visual Design', 'Creativity', 'Adobe Creative Suite', 'UI/UX Principles'],
    averageSalary: '₹20,00,000 - ₹50,00,000',
    jobOutlook: 'Good - Growing Digital Design Demand'
  }
}

export default function Results({ scores, onRestart, user }) {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [previousAssessments, setPreviousAssessments] = useState([])

  const sortedCareers = Object.entries(scores || {})
    .sort(([, a], [, b]) => b - a)

  const topCareer = sortedCareers[0]?.[0]
  const topRecommendations = sortedCareers.slice(0, 2).map(([career]) => CAREER_DETAILS[career]).filter(Boolean)

  const getScorePercentage = (score) => {
    return Math.min(Math.round((score / 100) * 100), 100)
  }

  useEffect(() => {
    if (user?.uid) {
      loadPreviousAssessments()
    }
  }, [user])

  const loadPreviousAssessments = async () => {
    try {
      const assessments = await getUserAssessments(user.uid, 5)
      setPreviousAssessments(assessments)
    } catch (error) {
      console.error('Error loading previous assessments:', error)
    }
  }

  const handleSaveResults = async () => {
    if (!user?.uid) {
      alert('Please sign in to save your results')
      return
    }

    setSaving(true)
    try {
      await saveAssessmentResult(user.uid, {
        scores,
        topCareer,
        answers: [] // You can pass the actual answers if available
      })
      setSaved(true)
      await loadPreviousAssessments() // Refresh the list
    } catch (error) {
      console.error('Error saving results:', error)
      alert('Failed to save results. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Your Career Assessment Results</h1>
        <p>Discover careers that match your skills and preferences</p>
      </div>

      <div className="scores-section">
        <h2>Career Match Scores</h2>
        <div className="scores-grid">
          {sortedCareers.map(([career, score]) => (
            <div key={career} className="score-card">
              <div className="score-icon">{CAREER_DETAILS[career]?.icon}</div>
              <div className="score-title">{career}</div>
              <div className="score-circle">
                <div className="score-percentage">{getScorePercentage(score)}%</div>
              </div>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${getScorePercentage(score)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recommendations-section">
        <h2>Your Top Career Matches</h2>
        <p className="recommendation-subtitle">Based on your assessment responses</p>
        <div className="recommendations-grid">
          {topRecommendations.map((career, idx) => (
            <div key={idx} className="recommendation-card">
              <div className="career-icon">{career.icon}</div>
              <h3>{career.title}</h3>
              <p>{career.description}</p>
              <div className="career-info">
                <div className="info-item">
                  <strong>Average Salary:</strong>
                  <span>{career.averageSalary}</span>
                </div>
                <div className="info-item">
                  <strong>Job Outlook:</strong>
                  <span>{career.jobOutlook}</span>
                </div>
              </div>
              <div className="skills-container">
                <h4>Key Skills:</h4>
                <div className="skills-list">
                  {career.skills.map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="match-score">Excellent Match</div>
            </div>
          ))}
        </div>
      </div>

      <div className="all-careers-section">
        <h2>All Career Options</h2>
        <div className="all-careers-grid">
          {sortedCareers.map(([career, score]) => {
            const careerData = CAREER_DETAILS[career]
            return (
              <div key={career} className="career-overview-card">
                <div className="career-overview-icon">{careerData?.icon}</div>
                <h4>{careerData?.title}</h4>
                <p className="match-percentage">{getScorePercentage(score)}% Match</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="insights-section">
        <h2>Key Insights</h2>
        <ul className="insights-list">
          <li>Your strongest match is <strong>{topCareer}</strong>. Consider exploring internships or entry-level positions in this field.</li>
          <li>India has a growing demand for professionals in all these fields. Choose based on your passion and aptitude.</li>
          <li>Consider pursuing relevant certifications or degrees from recognized institutions in India.</li>
          <li>Build a portfolio and gain practical experience through internships or projects in Indian companies.</li>
          <li>Network with professionals in your chosen field to understand market trends and opportunities in India.</li>
        </ul>
      </div>

      {user?.uid && (
        <div className="save-results-section">
          <button
            className="save-results-button"
            onClick={handleSaveResults}
            disabled={saving || saved}
          >
            {saving ? 'Saving...' : saved ? '✓ Results Saved' : '💾 Save Results'}
          </button>
          {saved && <p className="save-status">Your assessment results have been saved to your profile!</p>}
        </div>
      )}

      {previousAssessments.length > 0 && (
        <div className="previous-assessments-section">
          <h2>Your Previous Assessments</h2>
          <div className="assessments-grid">
            {previousAssessments.map((assessment, index) => (
              <div key={assessment.id} className="assessment-card">
                <div className="assessment-date">
                  {new Date(assessment.completedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="assessment-scores">
                  {Object.entries(assessment.scores).slice(0, 4).map(([career, score]) => (
                    <div key={career} className="assessment-score-item">
                      <div className="assessment-score-label">{career}</div>
                      <div className="assessment-score-value">{Math.round(score)}%</div>
                    </div>
                  ))}
                </div>
                <div className="assessment-top-career">
                  <h4>Top Career Match</h4>
                  <p>{assessment.topCareer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!user?.uid && previousAssessments.length === 0 && (
        <div className="previous-assessments-section">
          <h2>Your Assessment History</h2>
          <div className="no-assessments">
            <p>Sign in to save and view your assessment history</p>
          </div>
        </div>
      )}

      <button className="restart-button" onClick={onRestart}>
        Retake Assessment
      </button>
    </div>
  )
}
