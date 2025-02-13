import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"; 
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use(cors({
    origin: 'https://blog-app-1-y0ry.onrender.com', // Adjust this if your frontend is hosted elsewhere
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser()); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

// Serve static files from the 'public' folder
app.use('/upload', express.static(path.join(__dirname, '../client/public/upload')));


// Define routes for authentication, users, and posts
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);



// New route for Google Gemini API
app.use('/api/gemini', async (req, res) => {
  try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Get the prompt from the request body if needed
      const prompt = req.body.prompt;
      const text = `You are an AI named "Blog Assistant". 
                    When asked your name, say your name and respond with a small welcome text like "Hi, I'm Blog Assistant. How can I help you?". 
                    and when asked for generating a blog or any other questions, answer without this: "Hi, I'm Blog Assistant. How can I help you?" with Your primary duty is to answer users' questions about blog topics. The blog topics are: art, science, technology, design, food, and cinema.
                    For each blog request, provide a unique title and a detailed description. Ensure you do not repeat the same blog if it has already been provided. If a user asks something unrelated to these blog topics, politely remind them to focus on blog-related topics for today.
                    Make sure to provide a medium-large description if the user doesn't specify a length. Use clear and engaging language. If asked about any blog category multiple times, always provide a fresh response. 
                    Only reply when asked for a blog with a good title and description about the related topic.
                    The question is ${prompt}` 

      const result = await model.generateContent([text]); 
      const responseText = await result.response.text();
      
      // Send the generated content back as a response
      res.json({ response: result.response.text() });
  } catch (error) {
      console.error('Error fetching data from Google Gemini API:', error);
      res.status(500).json({ error: 'Error fetching data from Google Gemini API' });
  }
});


// Fallback route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html')); // Adjust path to your React build folder
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
