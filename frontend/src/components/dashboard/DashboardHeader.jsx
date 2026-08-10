import { Box, Typography } from "@mui/material";

function DashboardHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        Welcome back! 👋
      </Typography>

      <Typography color="text.secondary">
        Analyze your resume and discover better career opportunities.
      </Typography>
    </Box>
  );
}

export default DashboardHeader;