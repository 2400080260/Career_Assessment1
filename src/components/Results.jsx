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

export default function Results({ scores, onRestart }) {
  // Find the career with highest score
  const sortedCareers = Object.entries(scores || {})
    .sort(([, a], [, b]) => b - a)

  const topCareer = sortedCareers[0]?.[0]
  const topRecommendations = sortedCareers.slice(0, 2).map(([career]) => CAREER_DETAILS[career]).filter(Boolean)

  const getScorePercentage = (score) => {
    return Math.min(Math.round((score / 100) * 100), 100)
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

      <button className="restart-button" onClick={onRestart}>
        Retake Assessment
      </button>
    </div>
  )
}
