// App.js
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Write from './pages/Write';
import Home from './pages/Home';
import Single from './pages/Single';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './style.scss';
import { AuthContextProvider } from './context/authContext';
import Chatbot from "./components/Chatbot.jsx";
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ChatbotButton from "./components/ChatbotButton.jsx";

const Layout = () => (
  <> 
    <Navbar />
    <Outlet />
    <Footer />
    <ChatbotButton />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/post/:id", element: <Single /> },
      { path: "/chatbot", element: <Chatbot /> },
      { path: "/write", element: <Write /> },
    ]  
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <ErrorBoundary>
      <AuthContextProvider>
        <div className="app">
          <div className="container">
            <RouterProvider router={router} />
          </div>
        </div>
      </AuthContextProvider>
    </ErrorBoundary>
  );
}

export default App;
