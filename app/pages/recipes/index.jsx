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

const RecipesPage = ({initialData}) => {

    const classes = useStyles(),
        [recipes, setRecipes] = useState(initialData ? initialData.recipes : []);

    return <Container maxWidth={'xl'} style={{}}>
        <Head>
            <title>recipes-network</title>
        </Head>
        <Box mb={"24px"}>
            <Breadcrumbs>
                <Link href={"/"} scroll passHref>
                    <MaterialLink>Dashboard</MaterialLink>
                </Link>
                <Typography>Recipes</Typography>
            </Breadcrumbs>
        </Box>

        <Grid container spacing={3}>
            {recipes.map((recipe, index) => <Grid key={index} item xs={4}>
                <Card sx={{maxWidth: 345}}>
                    <Link href={`/recipes/${recipe.id}`} component={CardActionArea}>
                        <Box>
                            <CardMedia
                                component="img"
                                height="140"
                                image={recipe.files && recipe.files.length > 0 ? recipe.files[0].url : baseConfig.images.recipeDefault}
                                alt={`recipe_pic_${index}`}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {recipe.name}
                                    data
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {recipe.description}
                                </Typography>
                            </CardContent>
                        </Box>
                    </Link>
                </Card>
            </Grid>)}
        </Grid>
    </Container>

};

RecipesPage.getInitialProps = async ({req}) => {
    try {
        const res = await fetch(`${baseConfig.server.url}/recipes`);
        const recipes = await res.json();
        return {
            initialData: {
                recipes
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default RecipesPage;
