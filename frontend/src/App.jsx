import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Editior from './pages/Editior';
import NoPage from './pages/NoPage';

const App = () => {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
  return (
    <div>
     <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login"/>}/>
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/editor/:projectID" element={isLoggedIn ? <Editior /> : <Navigate to="/login"/>} />
           <Route path="*" element={isLoggedIn ? <NoPage />: <Navigate to="/login"/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
