import {
    Box,
    Button,
    Chip,
    Paper,
    Typography,
  } from "@mui/material";
  
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import OpenInNewIcon from "@mui/icons-material/OpenInNew";
  import { useNavigate } from "react-router-dom";
  
  const recommendations = [
    {
      title: "Senior Software Engineer",
      company: "Tech Solutions",
      location: "Bangalore, India",
      type: "Full-time",
      match: 94,
      description:
        "Your Java, Spring Boot, React and database experience makes you a strong fit for this position.",
      skills: ["Java", "Spring Boot", "React", "MySQL"],
      salary: "₹12L - ₹20L",
    },
    {
      title: "Full Stack Developer",
      company: "Innovate Labs",
      location: "Hyderabad, India",
      type: "Full-time",
      match: 91,
      description:
        "Your frontend development and REST API experience closely match the requirements of this role.",
      skills: ["React", "JavaScript", "REST APIs", "Git"],
      salary: "₹10L - ₹18L",
    },
    {
      title: "Backend Engineer",
      company: "Cloud Systems",
      location: "Pune, India",
      type: "Full-time",
      match: 88,
      description:
        "Your Spring Boot, Java and MySQL experience aligns well with this backend-focused opportunity.",
      skills: ["Java", "Spring Boot", "MySQL", "REST APIs"],
      salary: "₹9L - ₹16L",
    },
    {
      title: "Java Developer",
      company: "Digital Works",
      location: "Mumbai, India",
      type: "Full-time",
      match: 85,
      description:
        "Your Java development experience and understanding of backend technologies are highly relevant.",
      skills: ["Java", "Spring Boot", "SQL", "Git"],
      salary: "₹8L - ₹15L",
    },
    {
      title: "Frontend Developer",
      company: "Creative Technologies",
      location: "Remote",
      type: "Full-time",
      match: 82,
      description:
        "Your React, JavaScript, HTML and CSS skills match the core requirements of this position.",
      skills: ["React", "JavaScript", "HTML", "CSS"],
      salary: "₹7L - ₹14L",
    },
  ];
  
  function JobRecommendations() {
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
            maxWidth: "1100px",
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
            maxWidth: "1100px",
            mx: "auto",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Job Recommendations
          </Typography>
  
          <Typography color="text.secondary">
            Discover job opportunities recommended based on your resume,
            skills, experience and career goals.
          </Typography>
        </Box>
  
        {/* Summary */}
        <Box
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            mb: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {recommendations.length} recommended opportunities
            </Typography>
  
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Based on your latest resume analysis and detected skills.
            </Typography>
          </Paper>
        </Box>
  
        {/* Recommendations */}
        <Box
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {recommendations.map((job) => (
            <Paper
              key={job.title}
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {/* Top section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {job.title}
                  </Typography>
  
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {job.company}
                  </Typography>
  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    📍 {job.location} &nbsp; • &nbsp; {job.type}
                  </Typography>
                </Box>
  
                {/* Match */}
                <Box
                  sx={{
                    minWidth: 90,
                    textAlign: "center",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: "rgba(34, 197, 94, 0.08)",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "success.main",
                    }}
                  >
                    {job.match}%
                  </Typography>
  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Match
                  </Typography>
                </Box>
              </Box>
  
              {/* Description */}
              <Typography
                color="text.secondary"
                sx={{
                  mt: 3,
                  lineHeight: 1.7,
                }}
              >
                {job.description}
              </Typography>
  
              {/* Skills */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  Recommended skills
                </Typography>
  
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {job.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
  
              {/* Bottom section */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Estimated salary
                  </Typography>
  
                  <Typography
                    sx={{
                      fontWeight: 700,
                      mt: 0.3,
                    }}
                  >
                    {job.salary}
                  </Typography>
                </Box>
  
                <Button
                  variant="contained"
                  endIcon={<OpenInNewIcon />}
                  onClick={() => {
                    // Temporary frontend-only action.
                    alert(`Opening ${job.title} at ${job.company}`);
                  }}
                >
                  View Opportunity
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }
  
  export default JobRecommendations;