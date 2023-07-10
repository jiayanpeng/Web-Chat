import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from '../views/Main'
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Avatar from '../views/avatar/Avatar'

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/avatar' element={<Avatar />} />
      </Routes>
    </BrowserRouter>
  )
}