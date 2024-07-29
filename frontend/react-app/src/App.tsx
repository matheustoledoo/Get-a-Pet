import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'

/* Components */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'



/* pages */
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'
import Home from './components/pages/Home'



function App() {

  return (
    <Router>

          <Navbar />

          <Container>
            <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            </Routes>
          </Container>

          <Footer />

    </Router> 
  )
}

export default App
