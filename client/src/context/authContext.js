import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // The login function, in case you're calling it manually later
  const login = async (inputs) => {
    try {
      const res = await axios.post("https://blog-app-jsq6.onrender.com/api/auth/login", inputs); // Ensure this matches your backend route
      setCurrentUser(res.data);  // Store user data
      localStorage.setItem("user", JSON.stringify(res.data)); // Store user in local storage
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const register = async (inputs) => {
    try {
      await axios.post("https://blog-app-jsq6.onrender.com/api/auth/register", inputs);  // No need to add localhost:5000, because of proxy setup
      await login(inputs); // Log the user in automatically after registration
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };
  
  
  

  const logout = async () => {
    try {
      const res = await axios.post('https://blog-app-jsq6.onrender.com/api/auth/logout');
      console.log('Logout successful:', res.data);
      setCurrentUser(null); // Clear user state
    } catch (error) {
      console.error('Error:', error); // Log the entire error object
      if (error.res) {
        console.error('Response data:', error.res.data); // Logs specific response data
      }
      alert('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user"); // Clear local storage on logout
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
