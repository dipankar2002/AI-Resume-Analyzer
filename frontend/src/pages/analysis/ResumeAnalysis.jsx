import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Typography,
  } from "@mui/material";
  
  import { useNavigate } from "react-router-dom";
  
  function ResumeAnalysis() {
    const navigate = useNavigate();
  
    const analysis = {
      overallScore: 82,
      atsScore: 78,
      skillsScore: 90,
      experienceScore: 85,
  
      skills: [
        "Java",
        "Spring Boot",
        "React",
        "JavaScript",
        "MySQL",
        "Git",
        "REST APIs",
        "HTML",
        "CSS",
      ],
  
      strengths: [
        "Strong technical skill set",
        "Good project experience",
        "Solid understanding of modern web technologies",
        "Good combination of frontend and backend skills",
      ],
  
      improvements: [
        "Add measurable achievements to your experience",
        "Improve the resume summary",
        "Include more keywords related to your target roles",
        "Add specific results and impact from your projects",
      ],
  
      recommendations: [
        "Use stronger action verbs when describing your experience.",
        "Add numbers and measurable results wherever possible.",
        "Tailor your resume for each job description.",
        "Keep your resume concise and focused on relevant experience.",
      ],
    };
  
    const getScoreColor = (score) => {
      if (score >= 80) {
        return "success.main";
      }
  
      if (score >= 60) {
        return "warning.main";
      }
  
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
            maxWidth: "1200px",
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
              textTransform: "none",
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
              Resume Analysis
            </Typography>
  
            <Typography color="text.secondary">
              AI-powered insights from your uploaded resume.
            </Typography>
          </Box>
  
          {/* Resume information */}
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
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
                    Software_Engineer_Resume.pdf
                  </Typography>
  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Analysis completed
                  </Typography>
                </Box>
  
                <Chip
                  label="Analyzed"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
  
          {/* Overall score */}
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
                {/* Score */}
                <Box
                  sx={{
                    minWidth: { md: 180 },
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
                    Overall Score
                  </Typography>
  
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "3.5rem",
                        md: "4.5rem",
                      },
                      lineHeight: 1,
                      fontWeight: 800,
                      color: getScoreColor(
                        analysis.overallScore
                      ),
                    }}
                  >
                    {analysis.overallScore}%
                  </Typography>
  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Good resume
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
  
                {/* Score details */}
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Score Breakdown
                  </Typography>
  
                  <ScoreBar
                    label="ATS Compatibility"
                    score={analysis.atsScore}
                  />
  
                  <ScoreBar
                    label="Skills"
                    score={analysis.skillsScore}
                  />
  
                  <ScoreBar
                    label="Experience"
                    score={analysis.experienceScore}
                  />
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
            <CardContent
              sx={{
                p: { xs: 2.5, md: 3 },
              }}
            >
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
                Skills identified from your resume.
              </Typography>
  
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.2,
                }}
              >
                {analysis.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
  
          {/* Strengths and improvements */}
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
            {/* Strengths */}
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
                  Strengths
                </Typography>
  
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {analysis.strengths.map((strength) => (
                    <Box
                      key={strength}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "success.main",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </Typography>
  
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {strength}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
  
            {/* Areas to improve */}
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
                  Areas to Improve
                </Typography>
  
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {analysis.improvements.map((item) => (
                    <Box
                      key={item}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "warning.main",
                          fontWeight: 700,
                        }}
                      >
                        !
                      </Typography>
  
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
  
          {/* AI Recommendations */}
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
                p: { xs: 2.5, md: 3 },
              }}
            >
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
                Suggestions to make your resume stronger.
              </Typography>
  
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {analysis.recommendations.map(
                  (recommendation, index) => (
                    <Box
                      key={recommendation}
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
                        {recommendation}
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </CardContent>
          </Card>
  
          {/* Bottom actions */}
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
              onClick={() => navigate("/dashboard")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Back to Dashboard
            </Button>
  
            <Button
              variant="contained"
              onClick={() => navigate("/dashboard/upload")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Analyze Another Resume
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
  
  function ScoreBar({ label, score }) {
    return (
      <Box sx={{ mb: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 0.8,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600 }}
          >
            {label}
          </Typography>
  
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color:
                score >= 80
                  ? "success.main"
                  : score >= 60
                  ? "warning.main"
                  : "error.main",
            }}
          >
            {score}%
          </Typography>
        </Box>
  
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: 8,
            borderRadius: 5,
          }}
        />
      </Box>
    );
  }
  
  export default ResumeAnalysis;