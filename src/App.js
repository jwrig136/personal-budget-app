import "./App.scss";
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route
  } from 'react-router-dom';
import Menu from './Menu/Menu';
import Hero from './Hero/Hero';
import HomePage from './HomePage/HomePage';
import AboutPage from './AboutPage/AboutPage';
import LoginPage from './LoginPage/LoginPage';
import Footer from './Footer/Footer';

function App() {
  return (
    <Router>
      <Hero/>
      <Menu/>
      <div className="mainContainer">
        <Routes>
          <Route path ="/about" element={<AboutPage/>}></Route>
          <Route path ="/login" element={<LoginPage/>}></Route>
          <Route path ="/" element={<HomePage/>}></Route>
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
