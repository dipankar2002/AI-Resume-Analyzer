import {
    Box,
    Button,
    Paper,
    Typography,
    IconButton,
    Chip,
  } from "@mui/material";
  
  import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
  import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
  import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import CloseIcon from "@mui/icons-material/Close";
  
  import { useNavigate } from "react-router-dom";
  
  const resumes = [
    {
      id: 1,
      name: "Software_Engineer_Resume.pdf",
      status: "Analyzed",
      uploaded: "Recently uploaded",
    },
    {
      id: 2,
      name: "Frontend_Developer_Resume.pdf",
      status: "Not analyzed",
      uploaded: "Recently uploaded",
    },
  ];
  
  function MyResumes() {
    const navigate = useNavigate();
  
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        {/* Back button */}
        <Box
          sx={{
            maxWidth: "1000px",
            mx: "auto",
            mb: 3,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
  
        {/* Header */}
        <Box
          sx={{
            maxWidth: "1000px",
            mx: "auto",
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              My Resumes
            </Typography>
  
            <Typography color="text.secondary">
              Manage your uploaded resumes and view their AI analysis.
            </Typography>
          </Box>
  
          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => navigate("/dashboard/upload")}
          >
            Upload Resume
          </Button>
        </Box>
  
        {/* Resume list */}
        <Box
          sx={{
            maxWidth: "1000px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {resumes.map((resume) => (
            <Paper
              key={resume.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* Resume information */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(220, 38, 38, 0.08)",
                    color: "#DC2626",
                    flexShrink: 0,
                  }}
                >
                  <PictureAsPdfOutlinedIcon />
                </Box>
  
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {resume.name}
                  </Typography>
  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {resume.uploaded}
                  </Typography>
                </Box>
              </Box>
  
              {/* Status and actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={resume.status}
                  size="small"
                  color={
                    resume.status === "Analyzed"
                      ? "success"
                      : "default"
                  }
                  variant={
                    resume.status === "Analyzed"
                      ? "outlined"
                      : "filled"
                  }
                />
  
                {resume.status === "Analyzed" ? (
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityOutlinedIcon />}
                    onClick={() => navigate("/analysis")}
                  >
                    View Analysis
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => navigate("/dashboard/upload")}
                  >
                    Analyze
                  </Button>
                )}
  
                <IconButton
                  aria-label="Remove resume"
                  onClick={() => {}}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }
  
  export default MyResumes;