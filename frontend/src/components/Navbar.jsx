import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import {
  Show,
  UserButton,
} from "@clerk/react";

function Navbar() {
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "My Resumes",
      path: "/resumes",
    },
    {
      label: "Job Matches",
      path: "/jobs",
    },
    {
      label: "Recommendations",
      path: "/recommendations",
    },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#0F172A",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          minHeight: { xs: 64, md: 72 },
          px: { xs: 2, sm: 3, md: 0 },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          AI Resume Analyzer
        </Typography>

        {/* Navigation */}
        <Show when="signed-in">
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {navItems.map((item) => {
              const active =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    px: 2,
                    py: 1,
                    color: active
                      ? "primary.main"
                      : "text.secondary",
                    fontWeight: active ? 700 : 500,
                    borderRadius: 2,
                    position: "relative",

                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.06)",
                      color: "primary.main",
                    },

                    ...(active && {
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -1,
                        left: "20%",
                        right: "20%",
                        height: 2,
                        borderRadius: 2,
                        backgroundColor: "primary.main",
                      },
                    }),
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Show>

        {/* Right side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Logged out */}
          <Show when="signed-out">
            <Button
              component={Link}
              to="/login"
              color="inherit"
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
            >
              Get Started
            </Button>
          </Show>

          {/* Logged in */}
          <Show when="signed-in">
            <Button
              component={Link}
              to="/dashboard/upload"
              variant="contained"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                borderRadius: 2,
                px: 2,
              }}
            >
              Upload Resume
            </Button>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: 1,
                display: { xs: "none", sm: "block" },
              }}
            />

            <UserButton />
          </Show>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;