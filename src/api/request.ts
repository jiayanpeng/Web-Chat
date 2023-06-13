import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3001'

const request = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  url: 'http://localhost:3001'
})

export default request
