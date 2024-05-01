import "./App.scss";
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Hero from './Hero/Hero';
import HomePage from './HomePage/HomePage';
import LoginPage from './LoginPage/LoginPage';
import DashboardPage from './DashboardPage/DashboardPage';
import SignupPage from "./SignupPage/SignupPage";
import Footer from './Footer/Footer';
import { AuthProvider } from "./Auth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Hero />
        <div className="mainContainer">
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/signup" element={<SignupPage />}></Route>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
