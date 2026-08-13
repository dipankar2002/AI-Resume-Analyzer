import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";

import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

function JobRecommendations() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] =
    useState([]);

  const [keyword, setKeyword] =
    useState("");

  const [location, setLocation] =
    useState("India");

  const [jobType, setJobType] =
    useState("all");

  const [searchMode, setSearchMode] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadRecommendations();
  }, []);

  // =========================================================
  // LOAD PERSONALIZED RECOMMENDATIONS
  // =========================================================

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");
      setSearchMode(false);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/recommendations/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "No active resume found. Please select an active resume first."
            : "Failed to load recommendations."
        );
      }

      const data =
        await response.json();

      console.log(
        "PERSONALIZED RECOMMENDATIONS:",
        data
      );

      setRecommendations(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Recommendation error:",
        err
      );

      setError(
        err.message ||
          "Failed to load recommendations."
      );

      setRecommendations([]);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH FILTERED JOBS
  // =========================================================

  const searchJobs = async () => {

    if (!keyword.trim()) {
      setError(
        "Please enter a job title or skill."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearchMode(true);

      const token =
        await getToken();

      const params =
        new URLSearchParams();

      params.set(
        "keyword",
        keyword.trim()
      );

      params.set(
        "location",
        location.trim() ||
          "India"
      );

      params.set(
        "jobType",
        jobType
      );

      const response =
        await fetch(
          `${API_URL}/api/recommendations/me/search?${params.toString()}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to search jobs."
        );
      }

      const data =
        await response.json();

      console.log(
        "FILTERED RECOMMENDATIONS:",
        data
      );

      setRecommendations(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Job search error:",
        err
      );

      setError(
        err.message ||
          "Failed to search jobs."
      );

      setRecommendations([]);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SCORE COLOR
  // =========================================================

  const getScoreColor = (
    score
  ) => {

    if (score >= 75) {
      return "success.main";
    }

    if (score >= 50) {
      return "warning.main";
    }

    return "text.secondary";
  };

  // =========================================================
  // APPLY
  // =========================================================

  const applyToJob = (
    redirectUrl
  ) => {

    if (!redirectUrl) {
      return;
    }

    window.open(
      redirectUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box sx={{ mb: 3 }}>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Job Recommendations
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 750,
            lineHeight: 1.6,
          }}
        >
          Discover live jobs ranked according to
          how closely they match the skills from
          your active resume.
        </Typography>

      </Box>

      {/* =====================================================
          SEARCH / FILTER CARD
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          mb: 3,
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
          Find Other Jobs
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
          }}
        >
          Search live jobs when you want to explore
          opportunities outside your resume-based
          recommendations.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1.3fr 1fr auto",
            },
            gap: 2,
            alignItems: "center",
          }}
        >

          <TextField
            label="Job title or skill"
            placeholder="e.g. React Developer"
            value={keyword}
            onChange={(event) =>
              setKeyword(
                event.target.value
              )
            }
            fullWidth
          />

          <TextField
            label="Location"
            placeholder="India"
            value={location}
            onChange={(event) =>
              setLocation(
                event.target.value
              )
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>
              Job Type
            </InputLabel>

            <Select
              value={jobType}
              label="Job Type"
              onChange={(event) =>
                setJobType(
                  event.target.value
                )
              }
            >
              <MenuItem value="all">
                All Types
              </MenuItem>

              <MenuItem value="full_time">
                Full Time
              </MenuItem>

              <MenuItem value="part_time">
                Part Time
              </MenuItem>

              <MenuItem value="contract">
                Contract
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={
              <SearchOutlinedIcon />
            }
            onClick={searchJobs}
            disabled={loading}
            sx={{
              minHeight: 56,
              px: 3,
              textTransform: "none",
              borderRadius: 2,
              whiteSpace: "nowrap",
            }}
          >
            Search
          </Button>

        </Box>

        {searchMode && (
          <Button
            variant="text"
            onClick={
              loadRecommendations
            }
            sx={{
              mt: 1.5,
              textTransform: "none",
            }}
          >
            Back to Resume Recommendations
          </Button>
        )}

      </Paper>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =====================================================
          SECTION TITLE
      ===================================================== */}

      {!loading && (
        <Box sx={{ mb: 2 }}>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {searchMode
              ? "Search Results"
              : "Recommended for Your Resume"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {searchMode
              ? "Live jobs from Adzuna ranked against your resume skills."
              : "The strongest matches from live job listings."}
          </Typography>

        </Box>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>

      ) : recommendations.length === 0 ? (

        // ===================================================
        // EMPTY STATE
        // ===================================================

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
            {searchMode
              ? "No jobs found"
              : "No strong recommendations found"}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {searchMode
              ? "Try another job title, skill, or location."
              : "Try searching for a specific job title or skill using the filters above."}
          </Typography>

          {!searchMode && (
            <Button
              variant="outlined"
              onClick={() =>
                navigate("/jobs")
              }
              sx={{
                textTransform:
                  "none",
                borderRadius: 2,
              }}
            >
              View Job Matches
            </Button>
          )}

        </Paper>

      ) : (

        // ===================================================
        // JOB LIST
        // ===================================================

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >

          {recommendations.map(
            (job, index) => {

              const score =
                Number(
                  job.matchScore
                ) || 0;

              return (
                <Paper
                  key={
                    job.jobId ||
                    `job-${index}`
                  }
                  elevation={0}
                  sx={{
                    p: {
                      xs: 2.5,
                      sm: 3,
                    },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition:
                      "all 0.2s ease",

                    "&:hover": {
                      borderColor:
                        "primary.main",
                      boxShadow:
                        "0 6px 20px rgba(15, 23, 42, 0.06)",
                    },
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 3,
                      alignItems:
                        "flex-start",

                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                    }}
                  >

                    {/* JOB INFORMATION */}

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                        }}
                      >
                        {index + 1}.{" "}
                        {job.title ||
                          "Untitled Job"}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {job.company ||
                          "Unknown Company"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        📍{" "}
                        {job.location ||
                          "Location not specified"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >

                        {job.jobType && (
                          <Chip
                            label={
                              job.jobType
                            }
                            size="small"
                            variant="outlined"
                          />
                        )}

                        {job.salary && (
                          <Chip
                            label={
                              job.salary
                            }
                            size="small"
                            variant="outlined"
                          />
                        )}

                        <Chip
                          label={
                            job.matchLevel ||
                            "Match"
                          }
                          size="small"
                          color={
                            score >= 75
                              ? "success"
                              : score >= 50
                              ? "warning"
                              : "default"
                          }
                        />

                      </Box>

                    </Box>

                    {/* MATCH SCORE */}

                    <Box
                      sx={{
                        minWidth: 110,
                        textAlign: {
                          xs: "left",
                          sm: "center",
                        },
                      }}
                    >

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color:
                            getScoreColor(
                              score
                            ),
                        }}
                      >
                        {score.toFixed(1)}%
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Resume Match
                      </Typography>

                    </Box>

                  </Box>

                  {/* MATCHED SKILLS */}

                  {job.matchedSkillNames &&
                    job.matchedSkillNames
                      .length > 0 && (

                    <Box
                      sx={{
                        mt: 2.5,
                        pt: 2,
                        borderTop:
                          "1px solid",
                        borderColor:
                          "divider",
                      }}
                    >

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                        }}
                      >
                        Matching skills
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap:
                            "wrap",
                          gap: 1,
                        }}
                      >

                        {job.matchedSkillNames.map(
                          (
                            skill,
                            skillIndex
                          ) => (
                            <Chip
                              key={
                                `${skill}-${skillIndex}`
                              }
                              label={
                                skill
                              }
                              size="small"
                              variant="outlined"
                            />
                          )
                        )}

                      </Box>

                    </Box>
                  )}

                  {/* FOOTER */}

                  <Box
                    sx={{
                      mt: 2.5,
                      pt: 2,
                      borderTop:
                        "1px solid",
                      borderColor:
                        "divider",

                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: 2,
                      flexWrap:
                        "wrap",
                    }}
                  >

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Matched{" "}
                      <strong>
                        {job.matchedSkills ??
                          0}
                      </strong>{" "}
                      of{" "}
                      <strong>
                        {job.totalResumeSkills ??
                          0}
                      </strong>{" "}
                      resume skills
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={() =>
                        applyToJob(
                          job.redirectUrl
                        )
                      }
                      disabled={
                        !job.redirectUrl
                      }
                      sx={{
                        textTransform:
                          "none",
                        borderRadius: 2,
                      }}
                    >
                      Apply Now
                    </Button>

                  </Box>

                </Paper>
              );
            }
          )}

        </Box>
      )}

    </Box>
  );
}

export default JobRecommendations;