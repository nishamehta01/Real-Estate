import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './compnents/Header'
import PrivateRoute from './compnents/PrivateRoute'

const App = () => {
  return (
   <BrowserRouter>
   <Header />
   <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/sign-in" element={<SignIn />} />
     <Route path="/sign-up" element={<SignUp />} />
     <Route path="/about" element={<About />} />

     <Route element={<PrivateRoute />}>
     <Route path="/profile" element={<Profile />} />
     </Route>
     </Routes>
   </BrowserRouter>
  )
}

export default App
