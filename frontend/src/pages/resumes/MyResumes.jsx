import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";

import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

function MyResumes() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingActive, setSettingActive] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD RESUMES
  // =========================================================

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        "http://localhost:8080/api/resumes/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load resumes.");
      }

      const data = await response.json();

      const resumeList = Array.isArray(data) ? data : [];

      setResumes(resumeList);

      // Get active resume directly from backend response
      const activeResume = resumeList.find(
        (resume) => resume.active === true
      );

      setActiveResumeId(
        activeResume ? activeResume.resumeId : null
      );
    } catch (err) {
      setError(
        err.message || "Failed to load resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  // =========================================================
  // SET ACTIVE RESUME
  // =========================================================

  const setActiveResume = async (resumeId) => {
    try {
      setSettingActive(resumeId);
      setError("");
      setSuccess("");

      const token = await getToken();

      const response = await fetch(
        `http://localhost:8080/api/resumes/me/active/${resumeId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to set active resume."
        );
      }

      // Update local active resume
      setActiveResumeId(resumeId);

      // Update resume list so only selected resume
      // is marked active
      setResumes((current) =>
        current.map((resume) => ({
          ...resume,
          active: resume.resumeId === resumeId,
        }))
      );

      setSuccess(
        "Active resume updated successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to set active resume."
      );
    } finally {
      setSettingActive(null);
    }
  };

  // =========================================================
  // DELETE RESUME
  // =========================================================

  const deleteResume = async (resumeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const token = await getToken();

      const response = await fetch(
        `http://localhost:8080/api/resumes/${resumeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete resume."
        );
      }

      const deletedWasActive =
        activeResumeId === resumeId;

      setResumes((current) =>
        current.filter(
          (resume) =>
            resume.resumeId !== resumeId
        )
      );

      if (deletedWasActive) {
        setActiveResumeId(null);
      }

      setSuccess(
        "Resume deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete resume."
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 3, md: 5 },
      }}
    >
      {/* BACK BUTTON */}

      <Box
        sx={{
          maxWidth: "1000px",
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

      {/* PAGE HEADER */}

      <Box
        sx={{
          maxWidth: "1000px",
          mx: "auto",
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
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
            My Resumes
          </Typography>

          <Typography color="text.secondary">
            Manage your uploaded resumes and view
            their AI analysis.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <CloudUploadOutlinedIcon />
          }
          onClick={() =>
            navigate("/dashboard/upload")
          }
        >
          Upload Resume
        </Button>
      </Box>

      {/* ERROR */}

      {error && (
        <Box
          sx={{
            maxWidth: "1000px",
            mx: "auto",
            mb: 2,
          }}
        >
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      )}

      {/* SUCCESS */}

      {success && (
        <Box
          sx={{
            maxWidth: "1000px",
            mx: "auto",
            mb: 2,
          }}
        >
          <Alert severity="success">
            {success}
          </Alert>
        </Box>
      )}

      {/* RESUMES */}

      <Box
        sx={{
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
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
        ) : resumes.length === 0 ? (
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
              sx={{
                fontWeight: 600,
                mb: 1,
              }}
            >
              No resumes yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Upload your first resume to get
              started.
            </Typography>

            <Button
              variant="contained"
              startIcon={
                <CloudUploadOutlinedIcon />
              }
              onClick={() =>
                navigate("/dashboard/upload")
              }
            >
              Upload Resume
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {resumes.map((resume) => {
              const isActive =
                activeResumeId ===
                resume.resumeId;

              return (
                <Paper
                  key={resume.resumeId}
                  elevation={0}
                  sx={{
                    p: {
                      xs: 2,
                      sm: 3,
                    },
                    borderRadius: 3,

                    // Highlight active resume
                    border: "2px solid",
                    borderColor: isActive
                      ? "success.main"
                      : "divider",

                    backgroundColor: isActive
                      ? "rgba(46, 125, 50, 0.04)"
                      : "background.paper",

                    boxShadow: isActive
                      ? "0 4px 16px rgba(46, 125, 50, 0.12)"
                      : "none",

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    gap: 2,
                    flexWrap: "wrap",

                    transition:
                      "all 0.2s ease",
                  }}
                >
                  {/* RESUME INFO */}

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
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          "rgba(220, 38, 38, 0.08)",
                        color: "#DC2626",
                        flexShrink: 0,
                      }}
                    >
                      <PictureAsPdfOutlinedIcon />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {resume.fileName}
                        </Typography>

                        {/* ACTIVE BADGE */}

                        {isActive && (
                          <Chip
                            icon={
                              <CheckCircleOutlinedIcon />
                            }
                            label="ACTIVE"
                            size="small"
                            color="success"
                            sx={{
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {resume.uploadedAt
                          ? new Date(
                              resume.uploadedAt
                            ).toLocaleDateString()
                          : "Recently uploaded"}
                      </Typography>

                      {/* ACTIVE DESCRIPTION */}

                      {isActive && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,
                            color:
                              "success.dark",
                            fontWeight: 500,
                          }}
                        >
                          Currently used for
                          job matching and
                          recommendations
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* ACTIONS */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {isActive ? (
                      <Chip
                        icon={
                          <CheckCircleOutlinedIcon />
                        }
                        label="Active Resume"
                        color="success"
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          setActiveResume(
                            resume.resumeId
                          )
                        }
                        disabled={
                          settingActive ===
                          resume.resumeId
                        }
                      >
                        {settingActive ===
                        resume.resumeId ? (
                          <CircularProgress
                            size={18}
                          />
                        ) : (
                          "Set Active"
                        )}
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      startIcon={
                        <VisibilityOutlinedIcon />
                      }
                      onClick={() =>
                        navigate(
                          `/analysis/${resume.resumeId}`
                        )
                      }
                    >
                      View Analysis
                    </Button>

                    <IconButton
                      aria-label="Remove resume"
                      onClick={() =>
                        deleteResume(
                          resume.resumeId
                        )
                      }
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MyResumes;