import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
import ChatbotButton from "./ChatbotButton";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=art">
            <h6>ART</h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6>SCIENCE</h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6>TECHNOLOGY</h6>
          </Link>
          <Link className="link" to="/?cat=cinema">
            <h6>CINEMA</h6>
          </Link>
          <Link className="link" to="/?cat=design">
            <h6>DESIGN</h6>
          </Link>
          <Link className="link" to="/?cat=food">
            <h6>FOOD</h6>
          </Link>
          <span className="write">
            <Link className="link" to="/write">
              WRITE
            </Link>
          </span>
          {currentUser ? (
            <>
              <span>{currentUser.username}</span>
              <span onClick={handleLogout} style={{ cursor: 'pointer' }}>LOGOUT</span>
            </>
          ) : (
            <Link className="link" to="/login">
              LOGIN
            </Link>
          )}
        

        </div>
      </div>
      <ChatbotButton />
    </div>
  );
};

export default Navbar;
