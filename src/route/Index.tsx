import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from '../views/Main'
import Login from '../views/login/Login'

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}