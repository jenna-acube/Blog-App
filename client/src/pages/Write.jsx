import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation().state;
  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [draftSaved, setDraftSaved] = useState(false); // State for draft saved alert

  const navigate = useNavigate();

  // Load draft from local storage when the component mounts
  useEffect(() => {
    const savedTitle = localStorage.getItem("draftTitle");
    const savedContent = localStorage.getItem("draftContent");
    const savedCategory = localStorage.getItem("draftCategory");

    if (savedTitle) {
      setTitle(savedTitle);
    }
    if (savedContent) {
      setValue(savedContent);
    }
    if (savedCategory) {
      setCat(savedCategory);
    }

    if (state) {
      setTitle(state.title);
      setValue(state.desc);
      setCat(state.cat);
    }
  }, [state]);

  const upload = async () => {
  if (!file) return null; // Ensure the file exists

  try {
    const formData = new FormData();
    formData.append("file", file); // Correct field name must match the backend

    const res = await axios.post("https://blog-app-jsq6.onrender.com/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log('res', res)
    if (res.data) {
      return `/upload/${res.data}`;
    }
    return null;
  } catch (err) {
    console.error("Error uploading image:", err);
    return null;
  }
};

  
  const handleSave = () => {
    if (!title || !value || !cat) {
      alert("Please fill in all fields before saving the draft.");
      return; // Prevent saving if any field is empty
    }
  
    // Save title, content, and category to local storage
    localStorage.setItem("draftTitle", title);
    localStorage.setItem("draftContent", value);
    localStorage.setItem("draftCategory", cat); // Save the selected category
    setDraftSaved(true); // Show draft saved alert
  
    // Hide the alert after 3 seconds
    setTimeout(() => {
      setDraftSaved(false);
    }, 3000);
  };
  
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const imgUrl = file ? await upload() : state?.img;  // Get the image URL
      console.log("Updating:", state?.id, "Title:", title, "Desc:", value, "Category:", cat);

      if (state) {
        // Update the post
        const response = await axios.put(`https://blog-app-jsq6.onrender.com/api/posts/${state.id}`, {
          title,
          desc: value,
          cat,
          img: imgUrl,
        }, { withCredentials: true });
        
        console.log("Response from server:", response.data);
        
      } else {
        // Create a new post
        await axios.post("https://blog-app-jsq6.onrender.com/api/posts/", {
          title,
          desc: value,
          cat,
          img: imgUrl,  // Ensure the image URL is included
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        }, { withCredentials: true });
      }
  
      // Clear draft from local storage after publishing
      localStorage.removeItem("draftTitle");
      localStorage.removeItem("draftContent");
      localStorage.removeItem("draftCategory");
  
      navigate("/");
  
    } catch (err) {
      console.error("Error publishing post:", err);
    }
  };
  
  
  
  

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          value={title} // Set value for title input
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value} // Set value for the editor
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <div>
              <button onClick={handleSave}>Save as a draft</button>
              {draftSaved && <span className="alert">Draft saved!</span>} {/* Alert for draft saved */}
            </div>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "technology"}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "cinema"}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
