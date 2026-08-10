import {
    Box,
    Button,
    Paper,
    Typography,
  } from "@mui/material";
  
  import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
  
  import { useNavigate } from "react-router-dom";
  
  function UploadResumeCard() {
    const navigate = useNavigate();
  
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CloudUploadOutlinedIcon
            sx={{
              fontSize: 48,
              color: "primary.main",
              mb: 1,
            }}
          />
  
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Upload your resume
          </Typography>
  
          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Upload a PDF resume and let AI analyze your skills,
            experience and career opportunities.
          </Typography>
  
          <Button
            variant="contained"
            size="large"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => navigate("/dashboard/upload")}
            sx={{
              px: 4,
              py: 1.3,
              borderRadius: 2,
            }}
          >
            Upload Resume
          </Button>
        </Box>
      </Paper>
    );
  }
  
  export default UploadResumeCard;