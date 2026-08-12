import {
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import WorkIcon from "@mui/icons-material/Work";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function DashboardStats() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [stats, setStats] = useState({
    resumes: 0,
    analyses: 0,
    jobMatches: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const token = await getToken();

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch user's resumes
        const resumesResponse = await fetch(
          `${API_URL}/api/resumes/me`,
          {
            method: "GET",
            headers,
          }
        );

        if (!resumesResponse.ok) {
          throw new Error("Failed to fetch resumes");
        }

        const resumes = await resumesResponse.json();

        const analysesResponse = await fetch(
          `${API_URL}/api/resume-analysis/me`,
          {
            method: "GET",
            headers,
          }
        );

        if (!analysesResponse.ok) {
          throw new Error("Failed to fetch analyses");
        }

        const analyses = await analysesResponse.json();

        // Fetch job recommendations
        const jobsResponse = await fetch(
          `${API_URL}/api/recommendations/me`,
          {
            method: "GET",
            headers,
          }
        );

        let jobs = [];

        if (jobsResponse.ok) {
          jobs = await jobsResponse.json();
        }

        setStats({
          resumes: resumes.length,
          analyses: analyses.length,
          jobMatches: jobs.length,
        });
      } catch (error) {
        console.error(
          "Failed to fetch dashboard stats:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getToken]);

  const statCards = [
    {
      title: "My Resumes",
      value: stats.resumes,
      subtitle: "Uploaded resumes",
      icon: <DescriptionOutlinedIcon />,
      path: "/resumes",
    },
    {
      title: "AI Analyses",
      value: stats.analyses,
      subtitle: "Completed analysis",
      icon: <PsychologyOutlinedIcon />,
      path: "/resumes",
    },
    {
      title: "Job Matches",
      value: stats.jobMatches,
      subtitle: "Potential matches",
      icon: <WorkIcon />,
      path: "/jobs",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3, 1fr)",
        },
        gap: 3,
        mb: 4,
      }}
    >
      {statCards.map((stat) => (
        <Paper
          key={stat.title}
          elevation={0}
          onClick={() => navigate(stat.path)}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            cursor: "pointer",
            transition: "all 0.2s ease",

            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow:
                "0 8px 24px rgba(15, 23, 42, 0.08)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              color="text.secondary"
              sx={{
                fontWeight: 600,
              }}
            >
              {stat.title}
            </Typography>

            <Box
              sx={{
                color: "primary.main",
                display: "flex",
              }}
            >
              {stat.icon}
            </Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                height: 40,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {stat.value}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            {stat.subtitle}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default DashboardStats;