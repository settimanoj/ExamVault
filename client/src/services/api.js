import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export const setAuthToken = (token) => {
  API.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const clearAuthToken = () => {
  delete API.defaults.headers.common.Authorization
}

export const googleLogin = (idToken) => API.post('/auth/google', { idToken })

export const getCurrentUser = () => API.get('/auth/me')

// Upload a paper (multipart)
export const uploadPaper = (formData, onUploadProgress) =>
  API.post('/papers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })

// Get all papers with optional filters
export const getPapers = (filters = {}) =>
  API.get('/papers', { params: filters })

// Get slot papers with optional filters
export const getSlotPapers = (filters = {}) =>
  API.get('/papers/slot', { params: filters })

// Get PYQs with optional filters
export const getPYQs = (filters = {}) =>
  API.get('/papers/pyq', { params: filters })

// Delete a paper by id
export const getMyUploads = () => API.get('/papers/my-uploads')

export const deleteMyPaper = (id) => API.delete(`/papers/${id}`)

export const getAdminPapers = () => API.get('/admin/papers')

export const deletePaperAsAdmin = (id) => API.delete(`/admin/papers/${id}`)

export default API
