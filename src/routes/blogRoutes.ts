import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  addComment,
  deleteComment,
  getBlogsByCategory,
  getUserBlogs,
  getBlogStats,
  getTrendingBlogs,
} from "../controllers/blogController";

const router = Router();

// Blog CRUD routes
router.post("/blogs", createBlog);
router.get("/blogs", getAllBlogs);
router.get("/blogs/stats", getBlogStats);
router.get("/blogs/trending", getTrendingBlogs);
router.get("/blogs/category/:category", getBlogsByCategory);
router.get("/blogs/:id", getBlogById);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

// Blog interactions
router.post("/blogs/:id/like", likeBlog);
router.post("/blogs/:id/unlike", unlikeBlog);
router.post("/blogs/:id/comment", addComment);
router.delete("/blogs/:id/comment/:commentIndex", deleteComment);

// User blogs
router.get("/users/:userId/blogs", getUserBlogs);

export default router;
