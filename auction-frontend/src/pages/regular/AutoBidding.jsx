import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";

const AutoBidConfigPage = () => {
  const [config, setConfig] = useState({
    global_max: 0,
    alert_percent: 0,
  });
  const [usage, setUsage] = useState({
    used: 0,
    available: 0,
    percent: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configResponse, usageResponse] = await Promise.all([
          axiosInstance.get("/bids/auto-bid/global-config"),
          axiosInstance.get("/bids/auto-bid/usage"),
        ]);

        setConfig({
          global_max: Number(configResponse.data?.global_max),
          alert_percent: Number(configResponse.data?.alert_percent),
        });

        setUsage({
          used: Number(usageResponse.data?.used) || 0,
          available: Number(usageResponse.data?.available) || 0,
          percent: Number(usageResponse.data?.percent) || 0,
        });
      } catch (error) {
        setError("Failed to load configuration");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (config.global_max < usage.used) {
        throw new Error(
          `Budget cannot be lower than already used amount ($${usage.used.toFixed(2)})`
        );
      }

      await axiosInstance.post("/bids/auto-bid/global-config", {
        global_max: parseFloat(config.global_max),
        alert_percent: parseFloat(config.alert_percent),
      });

      const usageResponse = await axiosInstance.get("/bids/auto-bid/usage");
      console.log(usageResponse.data);

      setUsage({
        used: Number(usageResponse.data.used) || 0,
        available: Number(usageResponse.data.available) || 0,
        percent: Number(usageResponse.data.percent) || 0,
      });

      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      setError(error.response?.data?.error || error.message || "Error saving configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Math.max(0, parseFloat(value) || 0);

    setConfig((prev) => ({
      ...prev,
      [name]: name === "alert_percent" ? Math.min(100, numericValue) : numericValue,
    }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Global Auto-Bid Settings
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            Budget Usage: {usage.percent.toFixed(1)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, usage.percent)}
            sx={{ height: 10, borderRadius: 5, mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Used: ${usage.used.toFixed(2)} / Total: ${config.global_max.toFixed(2)}
            <br />
            Available: ${(config.global_max - usage.used).toFixed(2)}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Total Budget ($)"
          name="global_max"
          type="number"
          value={config.global_max === 0 ? "" : config.global_max}
          onChange={handleChange}
          sx={{ mb: 3 }}
          variant="outlined"
          required
          helperText="Maximum total amount available for all auto-bids"
        />

        <TextField
          fullWidth
          label="Alert Threshold (%)"
          name="alert_percent"
          type="number"
          value={config.alert_percent === 0 ? "" : config.alert_percent}
          onChange={handleChange}
          sx={{ mb: 3 }}
          variant="outlined"
          required
          helperText="Receive notification when budget usage reaches this percentage"
        />

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ width: 200 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Settings"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
            sx={{ width: 200 }}
          >
            Go Back
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {success}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default AutoBidConfigPage;
