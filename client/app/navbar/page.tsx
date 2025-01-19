import React from 'react';
import './navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className='navbar'>
      <div className='logo'>SoulBuddy</div>
      <ul className='navLinks'>
        <li><a href="/">Home</a></li>
        <li><a href="/aisuggestion">AI Components</a></li>
        <li><a href="/spiritualcontent">Health and Sleep</a></li>
        <li><a href="/gems">Gemstones</a></li>
        <li><a href="https://vetra-chat.vercel.app/">Talk to someone</a></li>
        <li><a href="/meditate">Meditation</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
