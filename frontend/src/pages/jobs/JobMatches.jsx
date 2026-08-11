import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";

function JobMatches() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const resumesResponse = await fetch(
        "http://localhost:8080/api/resumes/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resumesResponse.ok) {
        throw new Error("Failed to load your resumes.");
      }

      const resumes = await resumesResponse.json();

      if (!resumes || resumes.length === 0) {
        setError("Please upload a resume first.");
        return;
      }

      const resumeId = resumes[0].resumeId;

      const jobsResponse = await fetch(
        "http://localhost:8080/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!jobsResponse.ok) {
        throw new Error("Failed to load jobs.");
      }

      const jobData = await jobsResponse.json();

      const results = await Promise.all(
        jobData.map(async (job) => {
          try {
            const explanationResponse = await fetch(
              `http://localhost:8080/api/matching/${resumeId}/${job.jobId}/explanation`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!explanationResponse.ok) {
              return {
                ...job,
                matchScore: 0,
                matchedSkills: [],
                missingSkills: [],
              };
            }

            const explanation =
              await explanationResponse.json();

            return {
              ...job,
              matchScore: Number(
                explanation.matchScore || 0
              ),
              matchedSkills:
                explanation.matchedSkills || [],
              missingSkills:
                explanation.missingSkills || [],
            };
          } catch {
            return {
              ...job,
              matchScore: 0,
              matchedSkills: [],
              missingSkills: [],
            };
          }
        })
      );

      results.sort(
        (a, b) => b.matchScore - a.matchScore
      );

      setJobs(results);
    } catch (err) {
      setError(
        err.message || "Failed to load job matches."
      );
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "success.main";
    if (score >= 60) return "warning.main";
    return "error.main";
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
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
        }}
      >
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{
            mb: 3,
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          ← Back to Dashboard
        </Button>

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
            Discover jobs that match your skills and
            experience.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : jobs.length === 0 && !error ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No jobs available
            </Typography>

            <Typography color="text.secondary">
              There are currently no jobs to match against
              your resume.
            </Typography>
          </Paper>
        ) : (
          <>
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
                {jobs.length} potential matches
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Based on your resume skills and experience.
              </Typography>
            </Paper>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {jobs.map((job) => (
                <Paper
                  key={job.jobId}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
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
                        📍{" "}
                        {job.location ||
                          "Location not specified"}
                      </Typography>
                    </Box>

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
                          color: getMatchColor(
                            job.matchScore
                          ),
                        }}
                      >
                        {job.matchScore}%
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Match
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      mb: 3,
                      borderRadius: 2,
                      backgroundColor:
                        "rgba(37, 99, 235, 0.04)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Your resume matches this job based
                      on the skills required for the role.
                    </Typography>
                  </Box>

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

                    {job.matchedSkills.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        No matching skills found.
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {job.matchedSkills.map(
                          (skill, index) => (
                            <Chip
                              key={`${skill.skill}-${index}`}
                              label={skill.skill}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )
                        )}
                      </Box>
                    )}
                  </Box>

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
                        {job.missingSkills.map(
                          (skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              variant="outlined"
                            />
                          )
                        )}
                      </Box>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() =>
                        alert(
                          `Opening job: ${job.title} at ${job.company}`
                        )
                      }
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      View Job →
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default JobMatches;