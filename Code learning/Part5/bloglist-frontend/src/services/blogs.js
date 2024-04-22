import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {

  console.log('token', token)
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  console.log('token', token)
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${ baseUrl }/${id}`, newObject, config)
  return response
}

const remove = async (id) => {
  console.log('token', token)
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${ baseUrl }/${id}`, config)
  return response
}

export default { getAll, create, update, remove, setToken }