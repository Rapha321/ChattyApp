import React from 'react';

function NavBar(props) {

  const counter = props.userCount > 1 ? `${props.userCount} users online`
    : `${props.userCount} user online`;

  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">Chatty</a>
      <span className="navbar-counter">{counter}</span>
    </nav>
  );
}

export default NavBar;