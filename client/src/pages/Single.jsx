import React, { useEffect, useState, useContext } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

const Single = () => {
  const [post, setPost] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://blog-app-jsq6.onrender.com/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId, currentUser]); // Include currentUser in dependencies
  

   // Scroll to the top when the component mounts
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Run once when component mounts

  const handleDelete = async () => {
    try {
      await axios.delete(`https://blog-app-jsq6.onrender.com/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  

  // const getText = (html) => {
  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   return doc.body.textContent;
  // };

  // If post is null or undefined, show a loading message or a fallback
  if (!post) {
    return <div>Loading...</div>;
  }

  const getImagePath = (img) => {
    if (img && !img.startsWith("/upload/")) {
      return `/upload/${img}`; // Assuming images are stored in '/public/upload/'
    }
    return img;
  };

  return (
    <div className="single">
      <div className="content">
      <img src={getImagePath(post.img)} alt={post.title} />
        <div className="user">
          {post.userImg && <img src={post.userImg} alt="" />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser && currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}
        ></p>
      </div>
      <Menu cat={post.cat} currentPostId={post.id} />
    </div>
  );
};

export default Single;
