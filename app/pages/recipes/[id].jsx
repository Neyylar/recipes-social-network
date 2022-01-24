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
import {Card, CardContent, Chip, Grid, ListItem, ListItemText, useTheme} from "@material-ui/core";
import {useRouter} from "next/router";
import List from "@material-ui/core/List";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import MaterialLink from "@material-ui/core/Link";
import DetailsIcon from '@material-ui/icons/Details';
import KitchenIcon from '@material-ui/icons/Kitchen';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


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
    const theme = useTheme();
    const classes = useStyles(),
        [recipe, setRecipe] = useState(initialData ? initialData.recipe : {});

    const sliderSettings = {
        dots: true,
        autoplay: true,
        autoplaySpeed: 8000,
        infinite: true,
        speed: 500,
    };
    const stepsText = recipe?.steps.trim().split ('\n');
    return <Container maxWidth={'lg'} style={{}}>
        <Head>
            <title>{recipe?.name} - recipes-network</title>
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
                            {recipe?.files?.map((file, index) =>
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
                    <Grid container>
                        <Grid item xs={12}>
                            <Box>
                                <CardContent>
                                    <Typography gutterBottom variant="h4" component="div">
                                        {recipe?.name}
                                    </Typography>
                                    <Typography variant="h6" color={"secondary"}>
                                        {recipe?.description}

                                    </Typography>
                                    <Grid container spacing={2} mb={'5px'}>
                                        <Grid item xs={6}>
                                            <Typography variant="overline" color={"secondary"}>
                                                Preparation time
                                            </Typography>
                                            <Typography variant="body2" color={"secondary"}>
                                                {recipe?.preparationTime}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box>
                                                <Typography variant="overline" color={"secondary"}>
                                                    Portions
                                                </Typography>
                                                <Typography variant="body2" color={"secondary"}>
                                                    {recipe?.portions}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                        <Box mt={'5px'} ml={'5px'}>
                                            {recipe?.steps.trim().split ('\n').map(item =>
                                                <Typography variant="h6" color={"secondary"}>
                                                    <ArrowRightIcon/>
                                                    {item}
                                                </Typography>
                                                )}
                                        </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <List>
                                                <ListItem color={"secondary"} style={{backgroundColor: theme.palette.primary.main}}>
                                                    <Typography variant="overline" color = "textPrimary">
                                                        Products
                                                    </Typography>
                                                </ListItem>
                                                {recipe?.products?.map(({id, name}) =>
                                                    <ListItem color={"secondary"} style={{backgroundColor: theme.palette.primary.main, opacity: "65%"}}>
                                                        <KitchenIcon/>
                                                        <ListItemText variant="overline" primary={name}/>
                                                    </ListItem>
                                                )}
                                            </List>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <List>
                                                <ListItem color={"secondary"} style={{backgroundColor: theme.palette.primary.main}}>
                                                    <Typography variant="overline" color = "textPrimary">
                                                        Utensils
                                                    </Typography>
                                                </ListItem>
                                                {recipe?.utensils?.map(({id, name}) =>
                                                    <ListItem color={"secondary"} style={{backgroundColor: theme.palette.primary.main, opacity: "65%"}}>
                                                        <DetailsIcon />

                                                        <ListItemText primary={name}/>
                                                    </ListItem>
                                                )}
                                            </List>
                                        </Grid>
                                    </Grid>
                                    <Box mt={'2px'} display={"flex"} flexDirection={"row"}>
                                        {recipe?.hashtags?.map(({id, name}) =>
                                            <Box mr = {'10px'} >
                                                <Chip variant="outlined" color={"primary"} label={`#${name}`}/>
                                            </Box>
                                        )}
                                    </Box>
                                    <Box mt={'15px'} display={"flex"} flexDirection={"row"}>
                                        {recipe?.categories?.map(({name}) =>
                                            <Box mr={'10px'}>
                                                <Chip label={name}/>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    </Container>

};

RecipePage.getInitialProps = async (ctx) => {
    try {
        const id = ctx.query ? ctx.query.id : null;
        const res = await fetch(`${baseConfig.server.url}/recipes/${id}`);
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
