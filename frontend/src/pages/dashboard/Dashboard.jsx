import { Box } from "@mui/material";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardStats from "../../components/dashboard/DashboardStats";
import UploadResumeCard from "../../components/dashboard/UploadResumeCard";
import RecentResumes from "../../components/dashboard/RecentResumes";

function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <DashboardHeader />

        <DashboardStats />

        <UploadResumeCard />

        <RecentResumes />
      </Box>
    </Box>
  );
}

export default Dashboard;