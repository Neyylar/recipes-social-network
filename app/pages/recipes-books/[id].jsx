import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import {Card, CardActionArea, CardContent, CardMedia, Divider, Grid} from "@material-ui/core";
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

const RecipeBookPage = ({initialData}) => {

    const classes = useStyles(),
        [recipesBook, setRecipesBook] = useState(initialData ? initialData.recipesBook : null);

    return <Container maxWidth={'xl'} style={{}}>
        <Head>
            <title>recipes-network</title>
        </Head>
        <Box mb={"24px"}>
            <Breadcrumbs>
                <Link href={"/"} scroll passHref>
                    <MaterialLink>Dashboard</MaterialLink>
                </Link>
                <Link href={"/recipes"} scroll passHref>
                    <MaterialLink>Recipes Books</MaterialLink>
                </Link>
                <Typography>Recipes Book - {recipesBook?.name}</Typography>
            </Breadcrumbs>
        </Box>

        <Box>
            <Typography variant={'h2'}>{recipesBook?.name}</Typography>
            <Box mb={2}>
                <Divider />
            </Box>
            <Grid container spacing={3}>
                {recipesBook?.recipes?.map((recipe, index) => <Grid key={index} item xs={4}>
                    <Card sx={{maxWidth: 345}}>
                        <CardActionArea href={`/recipes/${recipe.id}`}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={recipe.files && recipe.files.length > 0 ? recipe.files[0].url : baseConfig.images.recipeDefault}
                                alt={`recipe_pic_${index}`}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {recipe.name}
                                </Typography>
                                <Typography variant="body2" color="secondary">
                                    {recipe.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>)}
            </Grid>
        </Box>
    </Container>

};

RecipeBookPage.getInitialProps = async (ctx) => {
    try {
        const id = ctx.query ? ctx.query.id : null;
        const res = await fetch(`${baseConfig.server.url}/recipes-books/${id}`);
        const recipesBook = await res.json();
        return {
            initialData: {
                recipesBook
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default RecipeBookPage;
