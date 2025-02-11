import express from "express";
import {
  getPost,
  getPosts,
  addPost,
  deletePost,
  updatePost,
} from "../controllers/post.js";

const router = express.Router();
router.post("/", addPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);



export default router;