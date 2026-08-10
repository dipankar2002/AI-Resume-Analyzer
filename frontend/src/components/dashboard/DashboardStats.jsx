import { Box, Paper, Typography } from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import WorkIcon from "@mui/icons-material/Work";

import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "My Resumes",
    value: "2",
    subtitle: "Uploaded resumes",
    icon: <DescriptionOutlinedIcon />,
    path: "/resumes",
  },
  {
    title: "AI Analyses",
    value: "1",
    subtitle: "Completed analysis",
    icon: <PsychologyOutlinedIcon />,
    path: "/analysis",
  },
  {
    title: "Job Matches",
    value: "8",
    subtitle: "Potential matches",
    icon: <WorkIcon />,
    path: "/jobs",
  },
];

function DashboardStats() {
  const navigate = useNavigate();

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
      {stats.map((stat) => (
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
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
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

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            {stat.value}
          </Typography>

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