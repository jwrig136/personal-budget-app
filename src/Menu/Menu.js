import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      localStorage.removeItem('jwt')
      navigate("/login");

    }).catch((error) => {
      alert(error);
    });
  }

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link onClick={handleLogout}>Logout</Link></li>
      </ul>
    </nav>
  );
}

export default Menu;