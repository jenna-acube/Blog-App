import React from 'react'
import Logo from "../img/logo.png"

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt=''/>
      <span>
        &copy; {new Date().getFullYear()} J's Blog Assistant. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer

