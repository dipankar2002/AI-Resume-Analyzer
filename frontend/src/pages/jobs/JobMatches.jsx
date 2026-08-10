import {
    Box,
    Button,
    Chip,
    Paper,
    Typography,
  } from "@mui/material";
  
  import { useNavigate } from "react-router-dom";
  
  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Solutions",
      location: "Bangalore, India",
      match: 92,
      skills: ["Java", "Spring Boot", "React", "MySQL"],
      missingSkills: ["Docker"],
      explanation:
        "Your Java, Spring Boot and React experience strongly matches the technical requirements for this role.",
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Innovate Labs",
      location: "Hyderabad, India",
      match: 87,
      skills: ["JavaScript", "React", "REST APIs", "Git"],
      missingSkills: ["Node.js", "AWS"],
      explanation:
        "Your frontend and API development experience makes you a strong candidate for this position.",
    },
    {
      id: 3,
      title: "Backend Developer",
      company: "Cloud Systems",
      location: "Pune, India",
      match: 81,
      skills: ["Java", "Spring Boot", "MySQL", "REST APIs"],
      missingSkills: ["Kubernetes"],
      explanation:
        "Your backend development experience aligns well with the core requirements of this role.",
    },
  ];
  
  function JobMatches() {
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
        <Box
          sx={{
            maxWidth: "1100px",
            mx: "auto",
          }}
        >
          {/* Back button */}
          <Button
            onClick={() => navigate("/dashboard")}
            sx={{
              mb: 3,
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            ← Back to Dashboard
          </Button>
  
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Job Matches
            </Typography>
  
            <Typography color="text.secondary">
              Discover jobs that match your skills, experience and career goals.
            </Typography>
          </Box>
  
          {/* Summary */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 4,
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
              8 potential matches
            </Typography>
  
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Based on your latest resume analysis.
            </Typography>
          </Paper>
  
          {/* Job list */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {jobs.map((job) => (
              <Paper
                key={job.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {/* Job information */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 3,
                    flexWrap: "wrap",
                    mb: 3,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
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
                      📍 {job.location}
                    </Typography>
                  </Box>
  
                  {/* Match score */}
                  <Box
                    sx={{
                      minWidth: 90,
                      textAlign: "center",
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
  
                {/* Explanation */}
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(37, 99, 235, 0.04)",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {job.explanation}
                  </Typography>
                </Box>
  
                {/* Matching skills */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Matching Skills
                  </Typography>
  
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {job.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
  
                {/* Missing skills */}
                {job.missingSkills.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      Skills to Improve
                    </Typography>
  
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {job.missingSkills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
  
                {/* View job */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      alert(
                        `Opening job: ${job.title} at ${job.company}`
                      );
                    }}
                  >
                    View Job →
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
  
  export default JobMatches;