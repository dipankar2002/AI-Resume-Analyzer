import { Box, Typography, Paper } from "@mui/material";
import { UserButton } from "@clerk/react";

function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome to your AI Resume Analyzer dashboard.
          </Typography>
        </Box>

        <UserButton />
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome 👋
        </Typography>

        <Typography color="text.secondary">
          Your resume analysis tools will appear here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Dashboard;