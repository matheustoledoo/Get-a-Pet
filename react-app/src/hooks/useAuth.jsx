import api from '../utils/api'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const history = useNavigate()
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true)
    }

    setLoading(false)
  }, [])

  async function register(user) {
    let msgText = 'Cadastro realizado com sucesso!'
    let msgType = 'success'

    try {
      const response = await api.post('/users/register', user)
      const data = response.data

      await authUser(data)
    } catch (error) {
      msgText = error.response?.data?.message || 'Ocorreu um erro, tente novamente mais tarde.'
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType)
  }

  async function login(user) {
    let msgText = 'Login realizado com sucesso!'
    let msgType = 'success'

    try {
      const response = await api.post('/users/login', user)
      const data = response.data

      await authUser(data)
    } catch (error) {
      msgText = error.response?.data?.message || 'Ocorreu um erro, tente novamente mais tarde.'
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType)
  }

  async function authUser(data) {
    setAuthenticated(true)
    localStorage.setItem('token', JSON.stringify(data.token))
    history('/')
  }

  function logout() {
    const msgText = 'Logout realizado com sucesso!'
    const msgType = 'success'

    setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization = undefined
    history('/login')

    setFlashMessage(msgText, msgType)
  }

  return { authenticated, loading, register, login, logout }
}
