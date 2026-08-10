import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F5F3FF 100%)",
        px: 2,
        py: 5,
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          backgroundColor: "rgba(37, 99, 235, 0.07)",
          top: -220,
          right: -170,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          backgroundColor: "rgba(124, 58, 237, 0.06)",
          bottom: -190,
          left: -150,
        }}
      />

      {/* Authentication content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Brand */}
        <Box
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            textAlign: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#2563EB",
              letterSpacing: "-0.5px",
            }}
          >
            AI Resume Analyzer
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              mt: 0.5,
            }}
          >
            Build a better resume. Get hired faster.
          </Typography>
        </Box>

        {/* Clerk card */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",

            "& .cl-rootBox": {
              width: "100%",
            },

            "& .cl-card": {
              width: "100%",
              maxWidth: 430,
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              boxShadow:
                "0 20px 50px rgba(15, 23, 42, 0.10)",
            },

            "& .cl-headerTitle": {
              fontFamily: "Inter, Arial, sans-serif",
              fontWeight: 700,
            },

            "& .cl-headerSubtitle": {
              fontFamily: "Inter, Arial, sans-serif",
            },

            "& .cl-formButtonPrimary": {
              backgroundColor: "#2563EB",
              fontFamily: "Inter, Arial, sans-serif",
              fontWeight: 600,
              borderRadius: "10px",
            },

            "& .cl-formButtonPrimary:hover": {
              backgroundColor: "#1D4ED8",
            },

            "& .cl-socialButtonsBlockButton": {
              borderRadius: "10px",
              fontFamily: "Inter, Arial, sans-serif",
            },

            "& .cl-footerActionLink": {
              color: "#2563EB",
              fontWeight: 600,
            },

            "& .cl-formFieldInput": {
              borderRadius: "10px",
              fontFamily: "Inter, Arial, sans-serif",
            },
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            mt: 3,
            color: "#64748B",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} AI Resume Analyzer
        </Typography>
      </Box>
    </Box>
  );
}

export default AuthLayout;