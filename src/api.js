const baseUrl = import.meta.env.VITE_API_BASE || ''

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Server request failed')
  }
  return data
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const signInWithGoogle = async (token) => {
  const response = await fetch(`${baseUrl}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  })

  const data = await handleResponse(response)
  localStorage.setItem('authToken', data.token)
  return data
}

export const signupUser = async (fullName, email, password) => {
  const response = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fullName, email, password })
  })

  const data = await handleResponse(response)
  localStorage.setItem('authToken', data.token)
  return data
}

export const loginUser = async (email, password) => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  const data = await handleResponse(response)
  localStorage.setItem('authToken', data.token)
  return data
}

export const logoutUser = () => {
  localStorage.removeItem('authToken')
}

export const saveAssessmentResult = async (userId, assessmentData) => {
  const response = await fetch(`${baseUrl}/api/assessments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(assessmentData)
  })

  return handleResponse(response)
}

export const getUserAssessments = async (userId, limitCount = 10) => {
  const response = await fetch(`${baseUrl}/api/assessments?limit=${limitCount}`, {
    headers: {
      ...getAuthHeaders()
    }
  })

  return handleResponse(response)
}
