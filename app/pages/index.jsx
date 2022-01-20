import React from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        fontWeight: 400,
    },
    title: {
        color: '#263238',
        fontSize: '24px'
    },
}));

const HomePage = ({initialData}) => {

    const classes = useStyles();
    // console.log("%cThis shit is Red!", "color: red;");

    return <Container maxWidth={'xl'} style={{marginTop: '85px'}}>
        <Head>
            <title>recipes-network</title>
        </Head>

        <Box mb={'30px'} mt={'30px'}>
        </Box>
        <Box>
        </Box>
        <Box m={'30px 0'}>
            <Typography className={classes.title} style={{marginBottom: '24px'}}>Usuarios</Typography>
        </Box>
    </Container>

};

HomePage.getInitialProps = async ({req}) => {
    try {
        return {
            initialData: {}
        }
    } catch (error) {
        console.error(error);
    }
}

export default HomePage;
