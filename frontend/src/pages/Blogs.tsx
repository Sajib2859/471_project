import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const API_URL = API_BASE_URL;

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: any;
  status: string;
  views: number;
  likes: any[];
  comments: any[];
  publishedAt?: string;
  createdAt: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: "", status: "published" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [commentText, setCommentText] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "recycling",
    tags: "",
    status: "published",
  });

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.category) params.append("category", filter.category);
      if (filter.status) params.append("status", filter.status);

      const response = await axios.get(`${API_URL}/blogs?${params}`);
      setBlogs(response.data.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogDetails = async (blogId: string) => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${blogId}`);
      setSelectedBlog(response.data.data);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to create a blog");
      return;
    }

    try {
      const blogData = {
        ...newBlog,
        tags: newBlog.tags.split(",").map((t) => t.trim()),
        author: user.id || user._id, // Support both id and _id
      };

      await axios.post(`${API_URL}/blogs`, blogData);
      alert("Blog created successfully!");
      setShowCreateForm(false);
      fetchBlogs();
      setNewBlog({
        title: "",
        content: "",
        excerpt: "",
        category: "recycling",
        tags: "",
        status: "published",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Error creating blog");
    }
  };

  const handleLike = async (blogId: string) => {
    if (!user) {
      alert("Please login to like");
      return;
    }
    try {
      await axios.post(`${API_URL}/blogs/${blogId}/like`, {
        userId: user.id || user._id,
      });
      fetchBlogs();
      if (selectedBlog?._id === blogId) {
        fetchBlogDetails(blogId);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Error liking blog");
    }
  };

  const handleComment = async (blogId: string) => {
    if (!user) {
      alert("Please login to comment");
      return;
    }
    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      await axios.post(`${API_URL}/blogs/${blogId}/comment`, {
        userId: user.id || user._id,
        content: commentText,
      });
      setCommentText("");
      fetchBlogDetails(blogId);
    } catch (error: any) {
      alert(error.response?.data?.message || "Error adding comment");
    }
  };

  const hasLiked = (blog: Blog) => {
    return blog.likes.some((l: any) => l === user?._id || l._id === user?._id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "recycling":
        return { bg: "#e8f5e9", color: "#2e7d32" };
      case "waste-management":
        return { bg: "#e3f2fd", color: "#1565c0" };
      case "best-practices":
        return { bg: "#f3e5f5", color: "#7b1fa2" };
      case "campaigns":
        return { bg: "#fff9c4", color: "#f57f17" };
      case "cleanup-news":
        return { bg: "#ffebee", color: "#c62828" };
      case "education":
        return { bg: "#fff3e0", color: "#e65100" };
      default:
        return { bg: "#e0e0e0", color: "#424242" };
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          📝 Blogs & Articles
        </h1>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          Learn about recycling, waste management best practices, and cleanup news
        </p>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          {showCreateForm ? "Cancel" : "✍️ Write New Article"}
        </button>

        {showCreateForm && (
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "2rem",
              borderRadius: "12px",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Create New Blog Post</h2>
            <form onSubmit={handleCreateBlog}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  required
                  placeholder="Enter blog title"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Excerpt (Short Summary) *
                </label>
                <textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  required
                  rows={2}
                  placeholder="Brief summary of your article..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Content *
                </label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  required
                  rows={8}
                  placeholder="Write your blog content here..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Category *
                  </label>
                  <select
                    value={newBlog.category}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, category: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <option value="recycling">Recycling</option>
                    <option value="waste-management">Waste Management</option>
                    <option value="best-practices">Best Practices</option>
                    <option value="campaigns">Campaigns</option>
                    <option value="cleanup-news">Cleanup News</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                    placeholder="plastic, recycling, tips"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Status *
                  </label>
                  <select
                    value={newBlog.status}
                    onChange={(e) => setNewBlog({ ...newBlog, status: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 2rem",
                  backgroundColor: "#9C27B0",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Publish Blog
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Categories</option>
            <option value="recycling">Recycling</option>
            <option value="waste-management">Waste Management</option>
            <option value="best-practices">Best Practices</option>
            <option value="campaigns">Campaigns</option>
            <option value="cleanup-news">Cleanup News</option>
            <option value="education">Education</option>
          </select>

          {(user?.role === "admin" || user?.role === "company") && (
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          )}
        </div>
      </div>

      {/* Selected Blog Detail View */}
      {selectedBlog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={() => setSelectedBlog(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "auto",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBlog(null)}
              style={{
                float: "right",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2 style={{ marginBottom: "1rem" }}>{selectedBlog.title}</h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  fontSize: "0.875rem",
                  ...getCategoryColor(selectedBlog.category),
                }}
              >
                {selectedBlog.category}
              </span>
              <span style={{ color: "#666" }}>👁️ {selectedBlog.views} views</span>
              <span style={{ color: "#666" }}>❤️ {selectedBlog.likes.length} likes</span>
              <span style={{ color: "#666" }}>💬 {selectedBlog.comments.length} comments</span>
            </div>

            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <p style={{ whiteSpace: "pre-wrap" }}>{selectedBlog.content}</p>
            </div>

            {selectedBlog.tags.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Tags: </strong>
                {selectedBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.5rem",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "12px",
                      fontSize: "0.875rem",
                      marginRight: "0.5rem",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {user && (
              <button
                onClick={() => handleLike(selectedBlog._id)}
                disabled={hasLiked(selectedBlog)}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: hasLiked(selectedBlog) ? "#e0e0e0" : "#FF4081",
                  color: hasLiked(selectedBlog) ? "#666" : "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: hasLiked(selectedBlog) ? "default" : "pointer",
                  marginBottom: "1rem",
                }}
              >
                {hasLiked(selectedBlog) ? "❤️ Liked" : "🤍 Like"}
              </button>
            )}

            {/* Comments Section */}
            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>
                Comments ({selectedBlog.comments.length})
              </h3>

              {user && (
                <div style={{ marginBottom: "1rem" }}>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <button
                    onClick={() => handleComment(selectedBlog._id)}
                    style={{
                      padding: "0.5rem 1.5rem",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Post Comment
                  </button>
                </div>
              )}

              <div style={{ maxHeight: "300px", overflow: "auto" }}>
                {selectedBlog.comments.map((comment: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                      {comment.user?.name || "Anonymous"}
                    </div>
                    <div style={{ color: "#666", fontSize: "0.875rem" }}>
                      {comment.content}
                    </div>
                    <div style={{ color: "#999", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blogs List */}
      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {blogs.map((blog) => {
            const categoryStyle = getCategoryColor(blog.category);

            return (
              <div
                key={blog._id}
                style={{
                  backgroundColor: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => fetchBlogDetails(blog._id)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.5rem" }}>{blog.title}</h3>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      backgroundColor: categoryStyle.bg,
                      color: categoryStyle.color,
                    }}
                  >
                    {blog.category}
                  </span>
                </div>

                <p style={{ color: "#666", marginBottom: "1rem" }}>{blog.excerpt}</p>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  <span>👁️ {blog.views} views</span>
                  <span>❤️ {blog.likes.length} likes</span>
                  <span>💬 {blog.comments.length} comments</span>
                  <span>
                    📅 {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {blog.tags.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "#e0e0e0",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          marginRight: "0.5rem",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Blogs;
