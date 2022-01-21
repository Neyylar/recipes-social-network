import { createTheme } from '@material-ui/core/styles';

const baseTheme = {
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"'
        ].join(','),
    },
    palette: {
        primary: {
            main: '#66A5AD',
            light: '#07575B',
            dark: '#003B46',
            contrastText:'#fff'
        },
        secondary: {
            main: '#07575B'
        }
    },
    zIndex: {
        drawer: 1000
    },
    overrides: {
        MuiCssBaseline: {
            "@global": {
                body: {
                    background:'#E5E5E5',
                    overflowX: 'hidden'
                },
                '*::-webkit-scrollbar': {
                    width: '0.6em',
                    height:'0.6em',
                    background:'rgba(255,255,255,.75)'
                },
                '*::-webkit-scrollbar-thumb': {
                    borderRadius: '20px',
                    backgroundColor: '#d0d0d0',
                    opacity:0.25
                }
            }
        },
        MuiTabs: {
            flexContainer: {
                justifyContent: 'center'
            }
        },
        MuiFormControl: {
            root: {
                width: '100%'
            }
        },
        MuiDialog: {
            paper: {
                borderRadius: '20px',
                margin: '16px'
            }
        },
        MuiButton: {
            root: {
                borderRadius: '8px'
            },
            contained: {
                fontWeight: 'bold',
            },
            outlined: {
                fontWeight: 'bold',
            },
            containedPrimary: {
                color: '#fff'
            },
            containedSecondary: {
                color: '#fff'
            }
        },
        MuiAppBar: {
            root: {
                //borderBottom: '2px solid #00B594'
            }
        },
        MuiToolbar: {
            root: {
                minHeight: '48px !important',
                paddingLeft: '12px !important',
                paddingRight: '12px !important'
            }
        },
        MuiCardHeader: {
            action: {
                marginTop: '0'
            }
        },
        MuiTypography: {
            h3: {
                fontSize: '36px',
                fontWeight: 'bold'
            }
        },
        MuiOutlinedInput: {
            input: {
                '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 100px #fff inset !important',
                    WebkitTextFillColor: '#2E2E4F',
                },
            },
        },
    }
};

const Theme = createTheme({
        ...baseTheme,
        palette: {
            ...baseTheme.palette,
            type: 'light'
        }
    }),
    DarkTheme = createTheme({
        ...baseTheme,
        palette: {
            ...baseTheme.palette,
            type: 'dark',
            background: {
                default: '#000000',
                paper: '#090910'
            },
            primary: {
                main: '#07575B'
            }
        },
        overrides: {
            ...baseTheme.overrides,
            MuiOutlinedInput: {
                input: {
                    '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px #2E2E4F inset !important',
                        WebkitTextFillColor: '#fff',
                    },
                },
            },
        }
    });

export {Theme, DarkTheme};
