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
import {useRouter} from "next/router";
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
                <Link href={"/recipes"} scroll passHref>
                    <MaterialLink>Recipes Books</MaterialLink>
                </Link>
                <Typography>Recipes Book - {recipe?.name}</Typography>
            </Breadcrumbs>
        </Box>

        <Grid container spacing={3}>
            {recipes.map((recipe, index) => <Grid item xs={4}>
                <Card sx={{maxWidth: 345}}>
                    <CardActionArea href={`/recipes/${index}`}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={recipe.files && recipe.files.length > 0 ? recipe.files[0].url : 'https://homechef.imgix.net/https%3A%2F%2Fasset.homechef.com%2Fuploads%2Fmeal%2Fplated%2F4896%2Fsalad4-aa062b86fac073f5d983645756d63818-aa062b86fac073f5d983645756d63818.png?ixlib=rails-1.1.0&w=850&auto=format&s=8d75ce0c54a1a9273ea19d8a8d254a12'}
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
                    </CardActionArea>
                </Card>
            </Grid>)}
        </Grid>
    </Container>

};

RecipeBookPage.getInitialProps = async ({req}) => {
    try {
        const id = ctx.query ? ctx.query.id : null;
        const res = await fetch(`${baseConfig.server.url}/recipes-books/${id}`);
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

export default RecipeBookPage;
