import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  ArrowBack,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login form submitted:", formData);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #F5F3FF 100%)",
        px: 2,
        py: 5,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            maxWidth: 480,
            mx: "auto",
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          }}
        >
          {/* Back to Home */}
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{
              mb: 3,
              color: "text.secondary",
            }}
          >
            Back to Home
          </Button>

          {/* Heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>

            <Typography color="text.secondary">
              Login to continue analyzing your resume
            </Typography>
          </Box>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              sx={{ mb: 1 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        edge="end"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                }
                label="Remember me"
              />

              <Button
                component={Link}
                to="/forgot-password"
                sx={{
                  fontSize: "0.875rem",
                }}
              >
                Forgot password?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              Login
            </Button>
          </Box>

          {/* Register Link */}
          <Box
            sx={{
              textAlign: "center",
              mt: 3,
            }}
          >
            <Typography color="text.secondary">
              Don't have an account?{" "}
              <Button
                component={Link}
                to="/register"
                sx={{
                  p: 0,
                  minWidth: "auto",
                  fontWeight: 600,
                }}
              >
                Create an account
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;