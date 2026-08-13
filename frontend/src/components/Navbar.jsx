import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  alpha,
} from "@mui/material/styles";
import {
  Palette,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useState } from "react";

import { Link, useLocation } from "react-router-dom";

import {
  Show,
  UserButton,
} from "@clerk/react";
import { useThemeSettings } from "../contexts/ThemeSettingsContext";

function Navbar() {
  const location = useLocation();
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);
  const {
    mode,
    colorPreset,
    colorPresets,
    setMode,
    setColorPreset,
  } = useThemeSettings();

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

  const isThemeMenuOpen = Boolean(themeMenuAnchor);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        borderBottom: (theme) =>
          `1px solid ${theme.palette.divider}`,
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
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
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
          <IconButton
            aria-label="theme settings"
            onClick={(event) => {
              setThemeMenuAnchor(event.currentTarget);
            }}
            sx={{
              border: (theme) =>
                `1px solid ${theme.palette.divider}`,
            }}
          >
            <Palette fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={themeMenuAnchor}
            open={isThemeMenuOpen}
            onClose={() => {
              setThemeMenuAnchor(null);
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              selected={mode === "light"}
              onClick={() => {
                setMode("light");
                setThemeMenuAnchor(null);
              }}
            >
              <ListItemIcon>
                <LightMode fontSize="small" />
              </ListItemIcon>
              <ListItemText>Light mode</ListItemText>
            </MenuItem>

            <MenuItem
              selected={mode === "dark"}
              onClick={() => {
                setMode("dark");
                setThemeMenuAnchor(null);
              }}
            >
              <ListItemIcon>
                <DarkMode fontSize="small" />
              </ListItemIcon>
              <ListItemText>Dark mode</ListItemText>
            </MenuItem>

            <Divider />

            {Object.keys(colorPresets).map((presetKey) => (
              <MenuItem
                key={presetKey}
                selected={colorPreset === presetKey}
                onClick={() => {
                  setColorPreset(presetKey);
                  setThemeMenuAnchor(null);
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor:
                        colorPresets[presetKey].primary,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{ textTransform: "capitalize" }}
                >
                  {presetKey}
                </ListItemText>
              </MenuItem>
            ))}
          </Menu>

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