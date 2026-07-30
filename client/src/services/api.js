const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Auth
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  },

  // Resumes
  uploadResume: async (formData) => {
    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },

  pasteResume: async (payload) => {
    const res = await fetch(`${API_BASE}/resumes/paste`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Parsing failed');
    return data;
  },

  getUserResumes: async () => {
    const res = await fetch(`${API_BASE}/resumes`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch resumes');
    return data.resumes || [];
  },

  deleteResume: async (id) => {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  // Jobs
  scrapeJobUrl: async (url) => {
    const res = await fetch(`${API_BASE}/jobs/scrape-url`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to scrape job URL');
    return data;
  },

  saveJob: async (jobData) => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save job');
    return data;
  },

  getUserJobs: async () => {
    const res = await fetch(`${API_BASE}/jobs`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
    return data.jobs || [];
  },

  deleteJob: async (id) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  // AI Tailor
  generateTailored: async (payload) => {
    const res = await fetch(`${API_BASE}/tailor/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI Tailoring failed');
    return data;
  },

  getTailoredHistory: async () => {
    const res = await fetch(`${API_BASE}/tailor/history`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch history');
    return data.history || [];
  },

  deleteTailored: async (id) => {
    const res = await fetch(`${API_BASE}/tailor/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await res.json();
  },

  // Export URLs
 getPDFExportUrl: (id, templateId = "modern") =>
  `${API_BASE}/export/pdf/${id}?template=${templateId}`,

getDOCXExportUrl: (id) =>
  `${API_BASE}/export/docx/${id}`
};
