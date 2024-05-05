import React from 'react';
import './Hero.scss';

function Hero() {
  return (
    <header>
      <a href="#main" className="skip">Skip to content</a>
      <div className="hero">
        <h1>Personal Budget App</h1>
      </div>
    </header>
  );
}

export default Hero;