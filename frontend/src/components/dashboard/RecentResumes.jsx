import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function RecentResumes() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError("");

        const token = await getToken();

        const response = await fetch(
          `${API_URL}/api/resumes/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch resumes");
        }

        const data = await response.json();

        setResumes(data);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
        setError("Unable to load resumes.");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [getToken]);

  const handleResumeAction = (resume) => {
    navigate(`/analysis/${resume.resumeId}`);
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

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "error.light",
          }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Paper>
      )}

      {/* Empty */}
      {!loading && !error && resumes.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            No resumes yet
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Upload your first resume to get started.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/upload")}
            sx={{
              borderRadius: 2,
            }}
          >
            Upload Resume
          </Button>
        </Paper>
      )}

      {/* Resume list */}
      {!loading && !error && resumes.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {resumes.map((resume) => (
            <Paper
              key={resume.resumeId}
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
                  boxShadow:
                    "0 4px 12px rgba(15, 23, 42, 0.06)",
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
                    backgroundColor:
                      "rgba(220, 38, 38, 0.08)",
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
                    {resume.fileName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {resume.uploadedAt
                      ? new Date(
                          resume.uploadedAt
                        ).toLocaleDateString()
                      : "Recently uploaded"}
                  </Typography>
                </Box>
              </Box>

              {/* Action */}
              <Button
                variant="outlined"
                onClick={() => handleResumeAction(resume)}
                sx={{
                  borderRadius: 2,
                  minWidth: 120,
                }}
              >
                View Analysis
              </Button>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default RecentResumes;