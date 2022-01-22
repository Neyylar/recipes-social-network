import React from 'react';
import Container from "@material-ui/core/Container";
import Head from "next/head";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import MaterialLink from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {Card, CardContent, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import RecipesBookCreator from "../../components/RecipesBook/Editor";

const useStyles = makeStyles(theme => ({
    cardRoot: {

    }
}));

const RecipesBookCreatePage = () => {
    const classes = useStyles();
    return(
        <Container maxWidth={false}>
            <Head>
                <title>Create recipe</title>
            </Head>
            <Box mb={"24px"}>
                <Breadcrumbs>
                    <Link href={"/"} scroll passHref>
                        <MaterialLink>Dashboard</MaterialLink>
                    </Link>
                    <Link href={"/recipes"} scroll passHref>
                        <MaterialLink>Recipes Books</MaterialLink>
                    </Link>
                    <Typography>Create recipes books</Typography>
                </Breadcrumbs>
            </Box>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Card className={classes.cardRoot}>
                        <CardContent style={{padding: '30px'}}>
                            <RecipesBookCreator/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

RecipesBookCreatePage.getInitialProps = async({req, apolloClient, agent}) => {
    return {};
};

export default RecipesBookCreatePage;