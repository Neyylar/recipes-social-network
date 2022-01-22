import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import Slider from 'react-slick'
import baseConfig from "../../base.config";
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {Card, CardContent, Chip, Grid, ListItem, ListItemText} from "@material-ui/core";
import {useRouter} from "next/router";
import List from "@material-ui/core/List";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import MaterialLink from "@material-ui/core/Link";

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
    const { asPath } = useRouter();
    const classes = useStyles(),
        [recipe, setRecipe] = useState(initialData ? initialData.recipe : {});

    const sliderSettings = {
        dots: true,
        autoplay: true,
        autoplaySpeed: 8000,
        infinite: true,
        speed: 500,
    };


    return <Container maxWidth={'lg'} style={{}}>
        <Head>
            <title>Create recipe</title>
        </Head>
        <Box mb={"24px"}>
            <Breadcrumbs>
                <Link href={"/"} scroll passHref>
                    <MaterialLink>Dashboard</MaterialLink>
                </Link>
                <Link href={"/recipes"} scroll passHref>
                    <MaterialLink>Recipes</MaterialLink>
                </Link>
                <Typography>Recipe - {recipe?.name}</Typography>
            </Breadcrumbs>
        </Box>

        <Grid container>
            <Grid item xs={12}>
                <Card>
                    <Box style={{width: '100%'}}>
                        <Slider {...sliderSettings}>
                            {recipe?.files.map((file, index) =>
                                <Box key={index} style={{backgroundColor: '#000'}}>
                                    <Box
                                        style={{
                                            height: '500px',
                                            background: `url(${file ? file.url : baseConfig.images.recipeDefault}) center no-repeat`,
                                        }}
                                    />
                                </Box>
                            )}
                        </Slider>
                    </Box>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {recipe?.name}
                        </Typography>
                        <Typography variant="body2" color={"secondary"}>
                            {recipe?.preparationTime}
                            {recipe?.portions}
                        </Typography>
                        <Typography variant="body2" color={"secondary"}>
                            {recipe?.description}
                        </Typography>
                        <Box ml={'8px'} mt={'2px'}>
                            <Typography variant="body2" color={"secondary"}>
                                {recipe?.steps}
                            </Typography>
                        </Box>
                        <Box mt={'2px'}>
                            {recipe?.hashtags.map(({id, name}) =>
                                <Chip label={name}/>
                            )}
                        </Box>
                        <Box>
                            {recipe?.categories.map(({name}) =>
                                <Chip label={name}/>
                            )}
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <List>
                                    {recipe?.products.map(({id, name}) =>
                                        <ListItem disablePadding color={"primary"}>
                                            <ListItemText primary={name}/>
                                        </ListItem>
                                    )}
                                </List>
                            </Grid>
                            <Grid item xs={6}>
                                <List>
                                    {recipe?.utensils.map(({id, name}) =>
                                        <ListItem disablePadding color={"secondary"}>
                                            <ListItemText primary={name}/>
                                        </ListItem>
                                    )}
                                </List>
                            </Grid>
                        </Grid>


                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </Container>

};

RecipePage.getInitialProps = async (ctx) => {
    try {
        const id = ctx.query ? ctx.query.id : null;
        const res = await fetch(`http://localhost:4000/recipes/${id}`);
        const recipe = await res.json();
        return {
            initialData: {
                recipe
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default RecipePage;
