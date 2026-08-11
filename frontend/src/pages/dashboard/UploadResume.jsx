import { useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

function UploadResume() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateFile = (file) => {
    setError("");
    setSuccess(false);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    validateFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    validateFile(event.dataTransfer.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccess(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setError("");
      setSuccess(false);
      setUploading(true);

      const token = await getToken();

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        "http://localhost:8080/api/resume/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Resume upload failed.");
      }

      await response.json();

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: "900px", mx: "auto", mb: 3 }}>
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          ← Back to Dashboard
        </Button>
      </Box>

      <Box sx={{ maxWidth: "900px", mx: "auto", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Upload Your Resume
        </Typography>

        <Typography color="text.secondary">
          Upload your resume and get AI-powered insights into your skills,
          experience, and career opportunities.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          maxWidth: "900px",
          mx: "auto",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 4, md: 5 },
            "&:last-child": {
              pb: { xs: 2, sm: 4, md: 5 },
            },
          }}
        >
          {!selectedFile ? (
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                minHeight: 300,
                border: "2px dashed",
                borderColor: dragActive
                  ? "primary.main"
                  : "rgba(37, 99, 235, 0.3)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
                cursor: "pointer",
                backgroundColor: dragActive
                  ? "rgba(37, 99, 235, 0.04)"
                  : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "rgba(37, 99, 235, 0.04)",
                },
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  color: "primary.main",
                  mb: 2,
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                ↑
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Upload your resume
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Drag & drop your PDF here or click to browse
              </Typography>

              <Button
                variant="contained"
                onClick={(event) => {
                  event.stopPropagation();
                  fileInputRef.current?.click();
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Upload File
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={handleFileChange}
              />
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(220, 38, 38, 0.08)",
                    color: "#DC2626",
                    flexShrink: 0,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  PDF
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(selectedFile.size)}
                  </Typography>
                </Box>

                <IconButton
                  onClick={removeFile}
                  disabled={uploading}
                  aria-label="Remove file"
                >
                  ×
                </IconButton>
              </Box>

              {uploading && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Uploading your resume...
                  </Typography>

                  <LinearProgress
                    sx={{
                      borderRadius: 5,
                      height: 7,
                    }}
                  />
                </Box>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Resume uploaded successfully.
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={removeFile}
                  disabled={uploading}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Choose Another
                </Button>

                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={uploading || success}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Resume"}
                </Button>
              </Box>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
              mt: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Supported format: PDF
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Maximum size: 10 MB
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UploadResume;