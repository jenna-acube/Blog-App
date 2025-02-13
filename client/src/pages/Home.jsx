import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const cat = useLocation().search;
  const [isActive, setIsActive] = useState(false);

  const truncateDescription = (desc, maxLength) => {
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://blog-app-jsq6.onrender.com/api/posts${cat}`);
        console.log('Fetched posts:', res.data); 
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat]); // Runs whenever the category (cat) changes

  useEffect(() => {
    setIsActive(true); // Set active class when component mounts
  }, []);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // Function to handle image path
  const getImagePath = (img) => {
    if (img && !img.startsWith("/upload/")) {
      return `/upload/${img}`; // Assuming images are stored in '/public/upload/'
    }
    return img;
  };

  return (
    <div className={`home ${isActive ? 'active' : ''}`}>
      <div className="posts">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div className="post" key={post.id}>
              <div className="img">
                <img src={getImagePath(post.img)} alt={post.title} />
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
                <p>{truncateDescription(getText(post.desc), 100)}</p>
                <Link to={`/post/${post.id}`}>
                  <button>Read More</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p> 
        )}
      </div>
    </div>
  );
};

export default Home;
