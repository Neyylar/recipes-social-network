import React from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import Link from "next/link";
import {Button, Card, CardContent, Paper} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: 'calc(100vh - 70px)',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 12px'
    },
    cardRoot: {
        borderRadius: '12px',
        maxWidth: '550px',
        width: '100%'
    },
    title: {
        color: '#263238',
        fontSize: '24px',
        textAlign: 'center',
    },
}));

const HomePage = ({initialData}) => {

    const classes = useStyles();
    // console.log("%cThis shit is Red!", "color: red;");

    return <Box>
        <Head>
            <title>recipes-network</title>
        </Head>
        <Container maxWidth={"lg"} className={classes.root}>
            <Box width={'100%'} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Card className={classes.cardRoot}>
                        <CardContent style={{padding: '30px'}}>
                            <Typography className={classes.title}>Welcome to recipes network!</Typography>
                            <Box display={'flex'} flexDirection={'column'}>
                                <Link href={"/recipes"} passHref scroll>
                                    <Button variant="outlined" size="medium" style={{marginTop: 16}}>
                                        Recipes
                                    </Button>
                                </Link>
                                <Link href={"/recipes/create"} passHref scroll>
                                    <Button variant="outlined" size="medium" style={{marginTop: 8}}>
                                        Create Recipe
                                    </Button>
                                </Link>
                                <Link href={"/recipes-books"} passHref scroll>
                                    <Button variant="outlined" size="medium" style={{marginTop: 8}}>
                                        Recipes Book
                                    </Button>
                                </Link>
                                <Link href={"/recipes-books/create"} passHref scroll>
                                    <Button variant="outlined" size="medium" style={{marginTop: 8}}>
                                        Create Recipe Book
                                    </Button>
                                </Link>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    </Box>

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
