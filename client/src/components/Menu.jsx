import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({ cat, currentPostId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://blog-app-jsq6.onrender.com/api/posts/?cat=${cat}`);
        console.log("Fetched posts:", res.data); // Log the response data

        // Check if the response data is an array
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          console.error("Expected an array, got:", res.data);
          setPosts([]); // Set to an empty array if not an array
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]); // Set to an empty array on error
      }
    };
    fetchData();
  }, [cat]);

  const getImagePath = (img) => {
    if (img && !img.startsWith("/upload/")) {
      return `/upload/${img}`; // Assuming images are stored in '/public/upload/'
    }
    return img;
  };

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {posts
        .filter(post => post.id !== currentPostId) // Filter out the current post
        .map((post) => (
          <div className="post" key={post.id}>
             <img src={getImagePath(post.img)} alt={post.title} />
            <h2>{post.title}</h2>
            <Link to={`/post/${post.id}`}>
              <button>Read More</button>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Menu;