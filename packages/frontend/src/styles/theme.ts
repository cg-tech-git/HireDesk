import { createTheme } from '@mui/material/styles';

// Tailwind color palette
const colors = {
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.blue[600],
      light: colors.blue[400],
      dark: colors.blue[800],
      contrastText: colors.slate[50],
    },
    secondary: {
      main: colors.slate[600],
      light: colors.slate[400],
      dark: colors.slate[800],
      contrastText: colors.slate[50],
    },
    error: {
      main: colors.red[600],
      light: colors.red[400],
      dark: colors.red[800],
      contrastText: colors.slate[50],
    },
    warning: {
      main: '#f59e0b', // Tailwind amber-500
      light: '#fbbf24', // Tailwind amber-400
      dark: '#d97706', // Tailwind amber-600
    },
    info: {
      main: '#0ea5e9', // Tailwind sky-500
      light: '#38bdf8', // Tailwind sky-400
      dark: '#0284c7', // Tailwind sky-600
    },
    success: {
      main: '#10b981', // Tailwind emerald-500
      light: '#34d399', // Tailwind emerald-400
      dark: '#059669', // Tailwind emerald-600
    },
    text: {
      primary: colors.slate[800],
      secondary: colors.slate[600],
      disabled: colors.slate[400],
    },
    background: {
      default: colors.slate[50],
      paper: '#ffffff',
    },
    divider: colors.slate[200],
  },
  typography: {
    fontFamily: [
      'Google Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 300,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
      color: colors.slate[900],
    },
    h2: {
      fontWeight: 300,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
      color: colors.slate[900],
    },
    h3: {
      fontWeight: 400,
      fontSize: '1.75rem',
      letterSpacing: '0em',
      color: colors.slate[900],
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
      color: colors.slate[900],
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.25rem',
      letterSpacing: '0em',
      color: colors.slate[900],
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '0.0075em',
      color: colors.slate[900],
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
      color: colors.slate[700],
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.00714em',
      color: colors.slate[700],
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
      color: colors.slate[800],
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01071em',
      color: colors.slate[600],
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.03333em',
      color: colors.slate[500],
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
      color: colors.slate[500],
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          letterSpacing: '0.02857em',
          '&:hover': {
            backgroundColor: colors.slate[100],
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          padding: '12px 24px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.slate[200],
            },
            '&:hover fieldset': {
              borderColor: colors.slate[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.blue[500],
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          borderRadius: '0.5rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: colors.slate[800],
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.slate[50],
          borderRight: '0px solid transparent',
          borderLeft: '0px solid transparent',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: colors.blue[50],
            color: colors.blue[600],
            '&:hover': {
              backgroundColor: colors.blue[100],
            },
          },
          '&:hover': {
            backgroundColor: colors.slate[100],
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 40,
        },
      },
    },
  },
});

export default theme; 