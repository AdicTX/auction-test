import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
			@font-face {
			  font-family: 'Poppins';
			  font-style: normal;
			  font-display: swap;
			  font-weight: 400;
			}
		  `,
    },
  },
  palette: {
    primary: {
      main: "#4A619E",
    },
    secondary: {
      main: "#8093D5",
    },
    info: {
      main: "#E8EFFF",
    },
    warning: {
      main: "#D3A518",
    },
    error: {
      main: "#E24E1B",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
