import axios from 'axios'

const API_TOKEN = import.meta.env.VITE_API_TOKEN
const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_TOKEN || !BASE_URL) {
  throw new Error('Missing required environment variables: VITE_API_TOKEN or VITE_API_BASE_URL')
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Token': API_TOKEN
  },
})

api.interceptors.request.use(
  (config) => {
    config.headers['X-Token'] = API_TOKEN
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


export default api 