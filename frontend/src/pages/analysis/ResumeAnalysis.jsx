import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";

import { useAuth } from "@clerk/react";
import { useNavigate, useParams } from "react-router-dom";

function ResumeAnalysis() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const { getToken } = useAuth();

  const [analysis, setAnalysis] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalysis();
  }, [resumeId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `http://localhost:8080/api/resume-analysis/${resumeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to analyze resume.");
      }

      const data = await response.json();

      setAnalysis(data);

      await loadSkills(token);
    } catch (err) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async (token) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/ai/analyze/${resumeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setSkills(data || []);
    } catch {
      // Skills are optional for displaying the ATS analysis.
    }
  };

  const analyzeAgain = async () => {
    try {
      setAnalyzing(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `http://localhost:8080/api/resume-analysis/${resumeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze resume.");
      }

      const data = await response.json();

      setAnalysis(data);

      await loadSkills(token);
    } catch (err) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "success.main";
    if (score >= 60) return "warning.main";
    return "error.main";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent resume";
    if (score >= 60) return "Good resume";
    return "Needs improvement";
  };

  const splitLines = (text) => {
    if (!text) return [];

    return text
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            AI is analyzing your resume...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !analysis) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          px: 3,
          py: 5,
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        <Button
          onClick={() => navigate("/resumes")}
          sx={{ mb: 3 }}
        >
          ← Back to My Resumes
        </Button>

        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analysis) {
    return null;
  }

  const atsScore = Number(analysis.atsScore || 0);
  const strengths = splitLines(analysis.strengths);
  const weaknesses = splitLines(analysis.weaknesses);
  const suggestions = splitLines(analysis.suggestions);

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
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Button
          onClick={() => navigate("/resumes")}
          sx={{
            mb: 3,
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          ← Back to My Resumes
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Resume Analysis
          </Typography>

          <Typography color="text.secondary">
            AI-powered insights generated from your uploaded resume.
          </Typography>
        </Box>

        {/* Summary */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Professional Summary
            </Typography>

            <Typography color="text.secondary">
              {analysis.professionalSummary ||
                "No professional summary was generated."}
            </Typography>
          </CardContent>
        </Card>

        {/* ATS Score */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                gap: 4,
              }}
            >
              <Box
                sx={{
                  minWidth: { md: 190 },
                  textAlign: {
                    xs: "left",
                    md: "center",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  ATS Score
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "3.5rem",
                      md: "4.5rem",
                    },
                    lineHeight: 1,
                    fontWeight: 800,
                    color: getScoreColor(atsScore),
                  }}
                >
                  {atsScore}%
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {getScoreLabel(atsScore)}
                </Typography>
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
              />

              <Box sx={{ flexGrow: 1, width: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  ATS Compatibility
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={atsScore}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Based on skills, experience, education, structure,
                  clarity, and relevant keywords.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Skills Detected
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Technical and professional skills identified by AI.
            </Typography>

            {skills.length === 0 ? (
              <Typography color="text.secondary">
                No skills detected.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.2,
                }}
              >
                {skills.map((item, index) => (
                  <Chip
                    key={`${item.skill}-${index}`}
                    label={
                      item.confidence != null
                        ? `${item.skill} (${Number(
                            item.confidence
                          ).toFixed(0)}%)`
                        : item.skill
                    }
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Strengths + Weaknesses */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
            mb: 3,
          }}
        >
          <InfoCard
            title="Strengths"
            items={strengths}
            symbol="✓"
            color="success.main"
          />

          <InfoCard
            title="Areas to Improve"
            items={weaknesses}
            symbol="!"
            color="warning.main"
          />
        </Box>

        {/* Suggestions */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              AI Recommendations
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Suggestions generated to improve your resume.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {suggestions.length === 0 ? (
                <Typography color="text.secondary">
                  No recommendations available.
                </Typography>
              ) : (
                suggestions.map((suggestion, index) => (
                  <Box
                    key={`${suggestion}-${index}`}
                    sx={{
                      display: "flex",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        "rgba(37, 99, 235, 0.04)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor:
                          "rgba(37, 99, 235, 0.1)",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        alignSelf: "center",
                      }}
                    >
                      {suggestion}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/resumes")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back to My Resumes
          </Button>

          <Button
            variant="contained"
            disabled={analyzing}
            onClick={analyzeAgain}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {analyzing ? "Analyzing..." : "Analyze Again"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function InfoCard({
  title,
  items,
  symbol,
  color,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {items.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No information available.
            </Typography>
          ) : (
            items.map((item, index) => (
              <Box
                key={`${item}-${index}`}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.2,
                }}
              >
                <Typography
                  sx={{
                    color,
                    fontWeight: 700,
                  }}
                >
                  {symbol}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {item}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResumeAnalysis;