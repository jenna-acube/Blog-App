import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getPost,
  getPosts,
  addPost,
  deletePost,
  updatePost,
} from "../controllers/post.js";

const router = express.Router();
router.post("/",authMiddleware, addPost);
router.get("/",authMiddleware, getPosts);
router.get("/:id",authMiddleware, getPost);
router.put("/:id",authMiddleware, updatePost);
router.delete("/:id",authMiddleware, deletePost);



export default router;