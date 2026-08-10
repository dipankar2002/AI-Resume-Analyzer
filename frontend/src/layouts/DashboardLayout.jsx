import { Box } from "@mui/material";

function DashboardLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "background.default",
      }}
    >
      {children}
    </Box>
  );
}

export default DashboardLayout;