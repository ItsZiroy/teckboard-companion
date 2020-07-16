import { createMuiTheme } from "@material-ui/core/styles";
const defaultSpacing = 1;
export const Spacing = {
  "1": `${defaultSpacing * 0.25}rem`,
  "2": `${defaultSpacing * 0.5}rem`,
  "3": `${defaultSpacing * 1}rem`,
  "4": `${defaultSpacing * 1.25}rem`,
  "5": `${defaultSpacing * 1.5}rem`,
};
export const Gradients = {
  primary: "linear-gradient(87deg, #172b4d 0, #1a174d 100%)",
  secondary: "linear-gradient(87deg, #fb6340, #fbb140)",
};
export default createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        fontWeight: 600,
        letterSpacing: 1,
      },
      contained: {
        color: "#fff",
      },
      containedPrimary: {
        "&:not(:disabled)": {
          background: Gradients.primary,
        },
      },
      containedSecondary: {
        background: Gradients.secondary,
      },
      textPrimary: {
        color: "#172b4d",
      },
      textSecondary: {
        color: "#fb6340",
      },
    },
    MuiDivider: {},
    MuiChip: {
      colorPrimary: {
        background: Gradients.primary,
      },
      colorSecondary: {
        background: Gradients.secondary,
      },
    },
    MuiFab: {
      secondary: {
        background: Gradients.secondary,
      },
    },
    MuiGrid: {},
    MuiPaper: {
      root: {
        color: "#172b4d",
      },
    },
    MuiListItem: {
      root: {
        "&:focus": {
          outline: "none",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#172b4d",
    },
    secondary: {
      main: "#fb6340",
    },
    success: {
      main: "#2dce89",
    },
    warning: {
      main: "#fb6340",
    },
    error: {
      main: "#ff0033",
    },
  },
  typography: {
    fontFamily: "Open Sans, sans-serif",
  },
});
