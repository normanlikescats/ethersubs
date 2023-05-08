import './App.css';
import React from "react";
import Navbar from './Components/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './Components/Landing';
import About from './Components/About';
import Home from './Components/Home';
import Profile from './Components/Profile';
import Creator from './Components/Creator';
import History from './Components/History';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element = {<Landing/>} />
          <Route path="/about" element = {<About/>} />
          <Route path="/app" element = {<Home/>} />
          <Route path="/profile/:id" element = {<Profile/>} />
          <Route path="/creator/:id" element = {<Creator/>} />
          <Route path="/history" element = {<History/>} />
        </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
