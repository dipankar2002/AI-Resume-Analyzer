import {
    Box,
    Button,
    Container,
    Typography,
  } from "@mui/material";
  
  import { Link } from "react-router-dom";
  import Navbar from "../components/Navbar";
  
  function Home() {
    return (
      <>
        <Navbar />
  
        <Box
          sx={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            background:
              "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F5F3FF 100%)",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                maxWidth: "800px",
                mx: "auto",
                textAlign: "center",
                py: 10,
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "2.5rem",
                    md: "4.5rem",
                  },
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Make Your Resume
                <br />
                <Box
                  component="span"
                  sx={{ color: "primary.main" }}
                >
                  Work Smarter
                </Box>
              </Typography>
  
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: "650px",
                  mx: "auto",
                  mb: 4,
                  lineHeight: 1.7,
                  fontWeight: 400,
                }}
              >
                Analyze your resume with AI, discover your skill
                gaps, improve your profile, and find job
                opportunities that match your skills.
              </Typography>
  
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Analyze My Resume
                </Button>
  
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </>
    );
  }
  
  export default Home;