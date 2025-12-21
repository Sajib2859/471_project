import { Request, Response } from "express";
import { Types } from "mongoose";
import Blog from "../models/Blog";
import User from "../models/User";
import Notification from "../models/Notification";

/**
 * POST /api/blogs
 * Create a new blog post
 */
export const createBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      author,
      coverImage,
      images,
      status,
    } = req.body;

    // Validation
    if (!title || !content || !excerpt || !category) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, content, excerpt, category",
      });
      return;
    }

    if (!author) {
      res.status(400).json({
        success: false,
        message: "Author user ID is required",
      });
      return;
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      author,
      coverImage: coverImage || undefined,
      images: images || [],
      status: status || 'draft',
      views: 0,
      likes: [],
      comments: [],
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating blog",
      error: error.message,
    });
  }
};

/**
 * GET /api/blogs
 * Get all blogs with optional filters
 */
export const getAllBlogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, category, author, tag } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (author) filter.author = author;
    if (tag) filter.tags = { $in: [tag] };

    const blogs = await Blog.find(filter)
      .populate("author", "name email role")
      .sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

/**
 * GET /api/blogs/:id
 * Get single blog by ID
 */
export const getBlogById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    const blog = await Blog.findById(id)
      .populate("author", "name email role")
      .populate("likes", "name email")
      .populate("comments.user", "name email");

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

/**
 * PUT /api/blogs/:id
 * Update blog
 */
export const updateBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    // If status is being changed to published and publishedAt is not set
    if (updates.status === 'published') {
      const existingBlog = await Blog.findById(id);
      if (existingBlog && !existingBlog.publishedAt) {
        updates.publishedAt = new Date();
      }
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating blog",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/blogs/:id
 * Delete blog
 */
export const deleteBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};

/**
 * POST /api/blogs/:id/like
 * Like a blog
 */
export const likeBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    if (blog.likes.some(l => l.equals(userObjectId))) {
      res.status(400).json({
        success: false,
        message: "You have already liked this blog",
      });
      return;
    }

    blog.likes.push(userObjectId);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog liked successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error liking blog",
      error: error.message,
    });
  }
};

/**
 * POST /api/blogs/:id/unlike
 * Unlike a blog
 */
export const unlikeBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    blog.likes = blog.likes.filter(l => !l.equals(userObjectId));
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog unliked successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error unliking blog",
      error: error.message,
    });
  }
};

/**
 * POST /api/blogs/:id/comment
 * Add a comment to a blog
 */
export const addComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    if (!userId || !content) {
      res.status(400).json({
        success: false,
        message: "User ID and comment content are required",
      });
      return;
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    blog.comments.push({
      user: new Types.ObjectId(userId),
      content,
      createdAt: new Date(),
    });

    await blog.save();

    // Notify blog author
    if (!blog.author.equals(new Types.ObjectId(userId))) {
      try {
        await Notification.create({
          userId: blog.author,
          type: "blog",
          title: "New Comment on Your Blog",
          message: `Someone commented on your blog "${blog.title}"`,
          relatedId: blog._id,
          read: false,
        });
      } catch (notifError) {
        console.error("Error creating notification:", notifError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/blogs/:id/comment/:commentIndex
 * Delete a comment from a blog
 */
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, commentIndex } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    const index = parseInt(commentIndex);
    if (isNaN(index) || index < 0 || index >= blog.comments.length) {
      res.status(400).json({
        success: false,
        message: "Invalid comment index",
      });
      return;
    }

    blog.comments.splice(index, 1);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message,
    });
  }
};

/**
 * GET /api/blogs/category/:category
 * Get blogs by category
 */
export const getBlogsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;

    const blogs = await Blog.find({ 
      category, 
      status: 'published' 
    })
      .populate("author", "name email role")
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching blogs by category",
      error: error.message,
    });
  }
};

/**
 * GET /api/users/:userId/blogs
 * Get user's blogs
 */
export const getUserBlogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const blogs = await Blog.find({ author: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user blogs",
      error: error.message,
    });
  }
};

/**
 * GET /api/blogs/stats
 * Get blog statistics
 */
export const getBlogStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });

    const blogsByCategory = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const totalLikes = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$likes' } } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
        byCategory: blogsByCategory,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog statistics",
      error: error.message,
    });
  }
};

/**
 * GET /api/blogs/trending
 * Get trending blogs (most viewed/liked)
 */
export const getTrendingBlogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const blogs = await Blog.find({ status: 'published' })
      .populate("author", "name email role")
      .sort({ views: -1, likes: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching trending blogs",
      error: error.message,
    });
  }
};
