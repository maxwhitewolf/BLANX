
import { createTheme } from '@mui/material/styles';

export const globalTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6c5ce7',
      light: '#a29bfe',
      dark: '#5f3dc4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fd79a8',
      light: '#fdcb6e',
      dark: '#e84393',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
      elevated: '#21262d',
    },
    surface: {
      main: '#1a1f26',
      light: '#262c35',
      dark: '#0d1117',
    },
    text: {
      primary: '#f0f6fc',
      secondary: '#8b949e',
      disabled: '#484f58',
    },
    divider: '#30363d',
    action: {
      hover: 'rgba(108, 92, 231, 0.08)',
      selected: 'rgba(108, 92, 231, 0.12)',
      disabled: '#484f58',
      disabledBackground: '#21262d',
    },
    success: {
      main: '#00d4aa',
      light: '#26de81',
      dark: '#00a085',
    },
    error: {
      main: '#ff6b6b',
      light: '#ff8787',
      dark: '#fa5252',
    },
    warning: {
      main: '#feca57',
      light: '#ff9ff3',
      dark: '#ff6348',
    },
    info: {
      main: '#54a0ff',
      light: '#74b9ff',
      dark: '#2f3542',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.8rem',
      },
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      borderRadius: '8px',
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '0px 4px 8px rgba(0, 0, 0, 0.12)',
    '0px 8px 16px rgba(0, 0, 0, 0.14)',
    '0px 12px 24px rgba(0, 0, 0, 0.16)',
    '0px 16px 32px rgba(0, 0, 0, 0.18)',
    '0px 20px 40px rgba(0, 0, 0, 0.20)',
    '0px 24px 48px rgba(0, 0, 0, 0.22)',
    '0px 28px 56px rgba(0, 0, 0, 0.24)',
    '0px 32px 64px rgba(0, 0, 0, 0.26)',
  ],
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (max-width:600px)': {
            paddingLeft: '12px',
            paddingRight: '12px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (max-width:600px)': {
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 25px rgba(108, 92, 231, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5f3dc4 0%, #6c5ce7 100%)',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8rem',
          '@media (max-width:600px)': {
            padding: '4px 12px',
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
          border: '1px solid #30363d',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (max-width:600px)': {
            borderRadius: '12px',
            margin: '8px 0',
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 35px rgba(0, 0, 0, 0.3)',
            borderColor: '#6c5ce7',
            '@media (max-width:600px)': {
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '@media (max-width:600px)': {
              borderRadius: '8px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6c5ce7',
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6c5ce7',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '@media (max-width:600px)': {
            padding: '8px',
          },
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(108, 92, 231, 0.1)',
          },
        },
        sizeSmall: {
          padding: '4px',
          '@media (max-width:600px)': {
            padding: '2px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '@media (max-width:600px)': {
            fontSize: '0.75rem',
            height: '24px',
          },
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(22, 27, 34, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #30363d',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(22, 27, 34, 0.98)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRight: '1px solid #30363d',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 8px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(108, 92, 231, 0.08)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          '@media (max-width:600px)': {
            borderRadius: '12px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          background: 'rgba(22, 27, 34, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #30363d',
          '@media (max-width:600px)': {
            margin: '16px',
            width: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          background: 'rgba(22, 27, 34, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #30363d',
          '@media (max-width:600px)': {
            borderRadius: '12px',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minHeight: '48px',
          '@media (max-width:600px)': {
            minHeight: '40px',
            fontSize: '0.875rem',
            padding: '8px 12px',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (max-width:600px)': {
            width: '48px',
            height: '48px',
          },
          '&:hover': {
            transform: 'scale(1.1)',
            background: 'linear-gradient(135deg, #5f3dc4 0%, #6c5ce7 100%)',
          },
        },
      },
    },
  },
});

export const darkTheme = globalTheme;
