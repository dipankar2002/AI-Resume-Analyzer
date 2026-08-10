import { Box } from "@mui/material";

import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "background.default",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;