import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import {Card, CardActionArea, CardContent, CardMedia, Grid} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import MaterialLink from "@material-ui/core/Link";
import baseConfig from "../../base.config";

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        fontWeight: 400,
    },
    title: {
        color: '#263238',
        fontSize: '24px'
    },
}));

const RecipeBooksPage = ({initialData}) => {

    const classes = useStyles(),
        [recipesBooks, setRecipesBooks] = useState(initialData ? initialData.recipesBooks : []);

    return <Container maxWidth={'xl'} style={{}}>
        <Head>
            <title>recipes-network</title>
        </Head>
        <Box mb={"24px"}>
            <Breadcrumbs>
                <Link href={"/"} scroll passHref>
                    <MaterialLink>Dashboard</MaterialLink>
                </Link>
                <Typography>Recipes Books</Typography>
            </Breadcrumbs>
        </Box>

        <Grid container spacing={3}>
            {recipesBooks?.map((book, index) => <Grid key={index} item xs={4}>
                <Card sx={{maxWidth: 345}}>
                    <CardActionArea href={`/recipes-books/${book.id}`}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={baseConfig.images.recipeDefault}
                            alt={`recipe_pic_${index}`}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5">
                                {book.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>)}
        </Grid>
    </Container>

};

RecipeBooksPage.getInitialProps = async ({req}) => {
    try {
        const res = await fetch(`${baseConfig.server.url}/recipes-books`);
        const recipesBooks = await res.json();
        return {
            initialData: {
                recipesBooks
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default RecipeBooksPage;