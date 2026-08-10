import {
    Box,
    Button,
    Paper,
    Typography,
  } from "@mui/material";
  
  import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
  import { useNavigate } from "react-router-dom";
  
  const resumes = [
    {
      name: "Software_Engineer_Resume.pdf",
      status: "Analyzed",
    },
    {
      name: "Frontend_Developer_Resume.pdf",
      status: "Not analyzed",
    },
  ];
  
  function RecentResumes() {
    const navigate = useNavigate();
  
    const handleResumeAction = (resume) => {
      if (resume.status === "Analyzed") {
        navigate("/analysis");
      } else {
        navigate("/analysis");
      }
    };
  
    return (
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Recent Resumes
        </Typography>
  
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {resumes.map((resume) => (
            <Paper
              key={resume.name}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
  
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
  
                flexWrap: "wrap",
                gap: 2,
  
                transition: "all 0.2s ease",
  
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
                },
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
                    width: 44,
                    height: 44,
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
                    color={
                      resume.status === "Analyzed"
                        ? "success.main"
                        : "text.secondary"
                    }
                    sx={{
                      mt: 0.5,
                      fontWeight:
                        resume.status === "Analyzed" ? 600 : 400,
                    }}
                  >
                    {resume.status}
                  </Typography>
                </Box>
              </Box>
  
              {/* Action */}
              <Button
                variant={
                  resume.status === "Analyzed"
                    ? "outlined"
                    : "contained"
                }
                onClick={() => handleResumeAction(resume)}
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                }}
              >
                {resume.status === "Analyzed"
                  ? "View Analysis"
                  : "Analyze"}
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }
  
  export default RecentResumes;