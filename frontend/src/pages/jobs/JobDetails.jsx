import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import { useAuth } from "@clerk/react";
import { useNavigate, useParams } from "react-router-dom";

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getToken();

        const response = await fetch(
          `http://localhost:8080/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load job details.");
        }

        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(
          err.message || "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadJob();
    }
  }, [jobId, getToken]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: "1100px",
          mx: "auto",
          px: 3,
          py: 5,
        }}
      >
        <Alert severity="error">{error}</Alert>

        <Button
          onClick={() => navigate("/jobs")}
          sx={{ mt: 2 }}
        >
          ← Back to Job Matches
        </Button>
      </Box>
    );
  }

  if (!job) {
    return null;
  }

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
          onClick={() => navigate("/jobs")}
          sx={{
            mb: 3,
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          ← Back to Job Matches
        </Button>

        {/* Main job card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              flexWrap: "wrap",
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
                {job.title}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {job.company}
              </Typography>

              <Typography color="text.secondary">
                📍 {job.location || "Location not specified"}
              </Typography>
            </Box>
          </Box>

          {/* Job information */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mt: 3,
            }}
          >
            {job.jobType && (
              <Chip
                label={job.jobType}
                variant="outlined"
              />
            )}

            {job.salary && (
              <Chip
                label={job.salary}
                variant="outlined"
              />
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Description */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Job Description
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.8,
            }}
          >
            {job.description ||
              "No job description available."}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* Apply button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                if (job.redirectUrl) {
                  window.open(
                    job.redirectUrl,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
              disabled={!job.redirectUrl}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 4,
              }}
            >
              Apply Now →
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default JobDetails;