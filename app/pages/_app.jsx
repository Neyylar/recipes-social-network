import React, {Fragment} from 'react';
import App from 'next/app';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Context, Theme} from '../components/App';
import "animate.css/animate.min.css";
import 'emoji-mart/css/emoji-mart.css'
import 'simplebar/dist/simplebar.min.css';
import "../public/main.css";
import Router from 'next/router';
import Box from "@material-ui/core/Box";
import {SnackbarProvider} from 'notistack';
import moment from "moment";
import NProgress from 'nprogress';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import Navbar from "../components/App/Navbar";


moment.locale("es");


Router.events.on('routeChangeStart', () => {
    NProgress.start();
});
Router.events.on('routeChangeComplete', () => {
    NProgress.done();
});
Router.events.on('routeChangeError', () => {
    NProgress.done();
});

class WebApp extends App {

    constructor(props) {
        super(props);
        moment.locale("es");
        this.state = {};
    }

    componentDidMount() {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles);
        //this.setState({});
    }


    render() {

        const {Component, pageProps, apollo} = this.props,
            {} = this.state;

        return (
            <Fragment>
                {/*<Head>*/}
                {/*    <title>{baseConfig.defaultTitle}</title>*/}
                {/*    <meta name="viewport" content="width=device-width, user-scalable=no"/>*/}
                {/*</Head>*/}
                <Context.Provider value={this.state}>
                    <ThemeProvider
                        // context to define between dark and light theme
                        // theme={this.state.darkMode ? DarkTheme : Theme}
                        theme={Theme}
                    >
                        <CssBaseline/>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <SnackbarProvider maxSnack={3}>
                                <Navbar/>
                                <div style={{position: 'absolute', top: 0}} id={"Home"}/>
                                <Box display={'flex'} width={'100%'}>
                                    <div style={{width: '100%'}}>
                                        <Component {...pageProps}/>
                                    </div>
                                </Box>
                            </SnackbarProvider>
                        </MuiPickersUtilsProvider>
                    </ThemeProvider>
                </Context.Provider>
            </Fragment>
        )
    }

    static getInitialProps = async ({Component, ctx}) => {
        try {
            let pageProps = {};
            if (Component) if (Component.getInitialProps) pageProps = await Component.getInitialProps({
                ...ctx
            });
            return {
                pageProps
            };
        } catch (error) {
            console.error(error);
        }
    };

}

export default WebApp;
