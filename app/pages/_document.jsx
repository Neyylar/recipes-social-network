/*_document.jsx*/
import React from 'react';
import Document, {Head, Html, Main, NextScript} from 'next/document';
import {ServerStyleSheets} from '@material-ui/core/styles';
import App from '../components/App';
import moment from "moment";

moment.locale("es");

class WebDocument extends Document {

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <Html lang="en">
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
                      rel="stylesheet"/>
                <link rel={"stylesheet"} type="text/css" charSet="UTF-8"
                      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
                <link rel={"stylesheet"} type="text/css"
                      href={"https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"}/>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff8e12"/>
                <meta name="msapplication-TileColor" content="#ff8e12"/>
                <meta name="theme-color" content="#ff8e12"/>
                <script src="https://www.google.com/recaptcha/api.js" async defer/>
                <style id="jss-server-side">${this.props.style}</style>
            </Head>
            <body style={{
                scrollBehavior: 'smooth'
            }}>
            <Main/>
            <NextScript/>
            </body>
            </Html>
        );
    }

    static getInitialProps = async (ctx) => {
        const sheets = new ServerStyleSheets(),
            originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: App => props => sheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            style: sheets.toString(),
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()]
        };
    };

}

export default WebDocument;
