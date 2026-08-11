import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";

function JobRecommendations() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        "http://localhost:8080/api/recommendations/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message =
          response.status === 404
            ? "No active resume found. Please select an active resume first."
            : "Failed to load recommendations.";

        throw new Error(message);
      }

      const data = await response.json();

      setRecommendations(data);
    } catch (err) {
      setError(
        err.message || "Failed to load recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
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
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{
            mb: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Dashboard
        </Button>

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
          sx={{ mb: 4 }}
        >
          Jobs ranked by how well they match your active
          resume.
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
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
        ) : recommendations.length === 0 ? (
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
            <Typography
              variant="h6"
              sx={{ mb: 1 }}
            >
              No recommendations yet
            </Typography>

            <Typography color="text.secondary">
              Select an active resume and try again.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {recommendations.map((job, index) => (
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
                    alignItems: "flex-start",
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
                      {index + 1}. {job.title}
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
                      {job.location ||
                        "Location not specified"}
                    </Typography>

                    {job.jobType && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {job.jobType}
                        {job.salary
                          ? ` • ${job.salary}`
                          : ""}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      textAlign: "center",
                      minWidth: 85,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: getScoreColor(
                          Number(job.matchScore)
                        ),
                      }}
                    >
                      {Number(job.matchScore).toFixed(1)}%
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Match
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default JobRecommendations;