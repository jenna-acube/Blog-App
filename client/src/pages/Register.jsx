import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Register = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://blog-app-jsq6.onrender.com/api/auth/register", inputs);
      const loginResponse = await axios.post("https://blog-app-jsq6.onrender.com/api/auth/login", {
        username: inputs.username,
        password: inputs.password,
      });
      setCurrentUser(loginResponse.data); // Assuming you have access to setCurrentUser
      navigate("/"); // Redirect to home page
    } catch (err) {
      if (err.response) {
        console.log(err.response.data); // Log server error message
        setError(err.response.data.message || "An error occurred");
      } else {
        console.log(err);  // Log other errors (network issues, etc.)
        setError("An unknown error occurred");
      }
    }
  };
  

  return (
    <div className='auth'>
      <h1>Register</h1>
      <form>
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
          autoComplete="username"
        />
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={handleChange}
          autoComplete="email"
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
          autoComplete="new-password"
        />
        <button onClick={handleSubmit}>Register</button>
        {err && <p>{typeof err === 'string' ? err : JSON.stringify(err)}</p>}
        <span>Do you have an account? <Link to="/login">Login</Link></span>
      </form>
    </div>
  );
};

export default Register;
