import React, { useState } from "react";
import { Card, Box, Stack, Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import ContentUpdateEditor from "./ContentUpdateEditor";
import { isLoggedIn } from "../helpers/authHelper";

const PostCard = (props) => {
  const { post: postData, removePost } = props;
  const [post, setPost] = useState(postData);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const user = isLoggedIn();
  const isAuthor = user && user.username === post.poster.username;
  const navigate = useNavigate();

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      const token = localStorage.getItem('token');
      await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLoading(false);
      if (removePost) removePost(post);
      else navigate("/");
    }
  };

  const handleEditPost = (e) => {
    e.stopPropagation();
    setEditing(!editing);
  };

  const handleSubmit = async (e, selectedImage) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData();
      formData.append('content', e.target.content.value);
      formData.append('userId', userData._id);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPost({ ...post, ...updatedPost });
        setEditing(false);
      } else {
        setEditing(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ padding: 2, marginBottom: 2 }}>
      {editing ? (
        <ContentUpdateEditor
          originalContent={post.content}
          originalImage={post.image}
          handleSubmit={handleSubmit}
        />
      ) : (
        <Box>
          {post.image && (
            <Box sx={{ mb: 2 }}>
              <img src={post.image} alt="Post" style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}
          <Typography variant="h6" sx={{ mb: 1 }}>{post.title}</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>{post.content}</Typography>
          <Typography variant="caption" color="text.secondary">
            Posted by {post.poster.username}
          </Typography>
          {isAuthor && (
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AiFillEdit />}
                onClick={handleEditPost}
                disabled={loading}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color={confirm ? "error" : "inherit"}
                startIcon={<BiTrash />}
                onClick={handleDeletePost}
                disabled={loading}
              >
                {confirm ? "Confirm Delete" : "Delete"}
              </Button>
            </Stack>
          )}
        </Box>
      )}
    </Card>
  );
};

export default PostCard; 