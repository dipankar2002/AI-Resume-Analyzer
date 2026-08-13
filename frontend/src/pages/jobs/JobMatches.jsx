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

import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

function JobMatches() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeResume, setActiveResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      // =====================================================
      // 1. GET USER RESUMES
      // =====================================================

      const resumesResponse = await fetch(
        `${API_URL}/api/resumes/me`,
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

      console.log("RESUMES FROM BACKEND:", resumes);

      // =====================================================
      // 2. FIND ACTIVE RESUME
      // =====================================================

      const active = resumes.find(
        (resume) => resume.active === true
      );

      console.log("ACTIVE RESUME:", active);

      if (!active) {
        setActiveResume(null);
        setSkills([]);
        setJobs([]);
        return;
      }

      setActiveResume(active);

      // =====================================================
      // 3. GET ACTIVE RESUME SKILLS
      // =====================================================

      const skillsResponse = await fetch(
        `${API_URL}/api/resumes/${active.resumeId}/skills`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!skillsResponse.ok) {
        throw new Error(
          "Unable to load skills from your active resume."
        );
      }

      const resumeSkills = await skillsResponse.json();

      console.log(
        "ACTIVE RESUME SKILLS:",
        resumeSkills
      );

      const skillNames = resumeSkills
        .map((resumeSkill) => {
          if (
            resumeSkill.skill &&
            resumeSkill.skill.skillName
          ) {
            return resumeSkill.skill.skillName;
          }

          return null;
        })
        .filter(Boolean);

      setSkills(skillNames);

      // =====================================================
      // 4. GET PERSONALIZED JOBS
      // =====================================================

      const jobsResponse = await fetch(
        `${API_URL}/api/jobs/live/personalized`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!jobsResponse.ok) {
        throw new Error(
          "Unable to load personalized jobs."
        );
      }

      const jobsData = await jobsResponse.json();

      console.log(
        "PERSONALIZED JOBS FROM BACKEND:",
        jobsData
      );

      // Backend returns List<Job> directly.
      // Example:
      // [
      //   {
      //     jobId: 1,
      //     title: "...",
      //     company: "...",
      //     location: "...",
      //     redirectUrl: "..."
      //   }
      // ]

      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
      } else if (
        jobsData &&
        Array.isArray(jobsData.results)
      ) {
        // Fallback in case another endpoint returns
        // an AdzunaJobResponse.
        setJobs(jobsData.results);
      } else {
        setJobs([]);
      }

    } catch (error) {
      console.error(
        "Job matching error:",
        error
      );

      setError(
        error.message ||
          "Unable to load job matches."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: 8,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================================================
  // NO ACTIVE RESUME
  // =========================================================

  if (!activeResume) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: {
            xs: 3,
            md: 4,
          },
        }}
      >
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
            Find jobs that match your resume skills.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <DescriptionOutlinedIcon
            sx={{
              fontSize: 55,
              color: "primary.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Select an Active Resume
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
              maxWidth: 550,
              mx: "auto",
            }}
          >
            Upload a resume or select an active resume
            to get personalized job matches.
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
              variant="contained"
              onClick={() => navigate("/resumes")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Select Resume
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Upload Resume
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1100,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        py: {
          xs: 3,
          md: 4,
        },
      }}
    >
      {/* PAGE HEADER */}

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

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 650,
            lineHeight: 1.6,
          }}
        >
          Jobs matched with the skills from your
          active resume.
        </Typography>
      </Box>

      {/* ACTIVE RESUME */}

      <Alert
        severity="success"
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        Using{" "}
        <strong>{activeResume.fileName}</strong>{" "}
        as your active resume.
      </Alert>

      {/* SKILLS */}

      {skills.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            Skills used for matching
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {skills.map((skill, index) => (
              <Chip
                key={`${skill}-${index}`}
                label={skill}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* JOBS */}

      {jobs.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <WorkOutlineOutlinedIcon
            sx={{
              fontSize: 55,
              color: "text.secondary",
              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            No matching jobs found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 500,
              mx: "auto",
            }}
          >
            We couldn't find jobs matching the skills
            from your active resume right now.
            Please try again later.
          </Typography>
        </Paper>
      ) : (
        // ===================================================
        // JOB LIST
        // ===================================================

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {jobs.map((job, index) => (
            <Paper
              key={
                job.jobId ||
                job.id ||
                index
              }
              elevation={0}
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease",

                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow:
                    "0 6px 20px rgba(15, 23, 42, 0.06)",
                },
              }}
            >
              {/* TITLE */}

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {job.title || "Untitled Job"}
              </Typography>

              {/* COMPANY */}

              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {job.company || "Unknown Company"}
              </Typography>

              {/* LOCATION */}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                }}
              >
                📍 {job.location || "India"}
              </Typography>

              {/* JOB TYPE */}

              {job.jobType && (
                <Chip
                  label={job.jobType}
                  size="small"
                  variant="outlined"
                  sx={{
                    mr: 1,
                    mb: 1.5,
                  }}
                />
              )}

              {/* SALARY */}

              {job.salary && (
                <Chip
                  label={`Salary: ${job.salary}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    mr: 1,
                    mb: 1.5,
                  }}
                />
              )}

              {/* DESCRIPTION */}

              {job.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.6,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {job.description}
                </Typography>
              )}

              {/* APPLY */}

              <Button
                variant="contained"
                disabled={!job.redirectUrl}
                onClick={() => {
                  if (job.redirectUrl) {
                    window.open(
                      job.redirectUrl,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Apply Now →
              </Button>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default JobMatches;