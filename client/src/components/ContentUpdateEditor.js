import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const ContentUpdateEditor = (props) => {
  const [content, setContent] = useState(props.originalContent);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(props.originalImage || null);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    let error = null;
    if (props.validate) {
      error = props.validate(content);
    }
    if (error && error.length !== 0) {
      setError(error);
    } else {
      // Pass selectedImage to parent handler
      props.handleSubmit(e, selectedImage);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack>
        <TextField
          value={content}
          fullWidth
          margin="normal"
          name="content"
          sx={{ backgroundColor: "white" }}
          onChange={handleChange}
          error={error.length !== 0}
          helperText={error}
          multiline
        />
        {/* Image Preview and Input */}
        {imagePreview && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Image Preview:</Typography>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
          </Box>
        )}
        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          {selectedImage ? "Change Image" : "Replace Image"}
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        <Button
          type="submit"
          variant="outlined"
          sx={{ backgroundColor: "white", mt: 1 }}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
};

export default ContentUpdateEditor; 