import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import {Button, Card, CardActionArea, CardContent, CardMedia, Grid} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        fontWeight: 400,
    },
    title: {
        color: '#263238',
        fontSize: '24px'
    },
}));

const RecipePage = ({initialData}) => {

    const classes = useStyles(),
        [recipes, setRecipes] = useState(initialData ? initialData.recipes : []);

    return <Container maxWidth={'xl'} style={{marginTop: '85px'}}>
        <Head>
            <title>recipes-network</title>
        </Head>
        <Button color="inherit" href={'/recipes/'}>Go back</Button>


        {recipes.map((recipe, index) =>
            <Card sx={{maxWidth: 600}}>
                <CardMedia
                    component="img"
                    height="400"
                    image={recipe.files && recipe.files.length > 0 ? recipe.files[0].url : 'https://homechef.imgix.net/https%3A%2F%2Fasset.homechef.com%2Fuploads%2Fmeal%2Fplated%2F4896%2Fsalad4-aa062b86fac073f5d983645756d63818-aa062b86fac073f5d983645756d63818.png?ixlib=rails-1.1.0&w=850&auto=format&s=8d75ce0c54a1a9273ea19d8a8d254a12'}
                    alt={`recipe_pic_${index}`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipe.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipe.description}
                    </Typography>
                </CardContent>
            </Card>)}
    </Container>

};

RecipePage.getInitialProps = async ({req}) => {
    try {
        return {
            initialData: {
                recipes: [
                    {name: 'reciep1', description: 'LOREM ipsum'},
                ]
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default RecipePage;
