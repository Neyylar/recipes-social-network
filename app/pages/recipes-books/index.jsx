import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import {Card, CardActionArea, CardContent, CardMedia, Grid, useTheme} from "@material-ui/core";
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
        theme = useTheme(),
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
            {recipesBooks?.map((book, index) => {
                let images = book.recipes?.length > 0 ? book.recipes.reduce((acc, item) => {
                    if (item.files?.length > 0) acc.push(item.files[0].url);
                    return acc;
                }, []) : [];
                images = images.length > 0 ? images : [baseConfig.images.recipeDefault];
                images = images.slice(0, 4);
                const getGridWidth = (_index) => images.length > 1 ? ((images.length === 3 && _index === 2) ? 12 : 6) : 12;
                return <Grid key={index} item xs={4}>
                    <Card sx={{maxWidth: 345}}>
                        <Link href={`/recipes-books/${book.id}`} Component={CardActionArea}>
                            <Box>
                            <Box height={'140px'}>
                                <Grid container spacing={1} style={{backgroundColor: `${theme.palette.primary.main}BB`}}>
                                    {images.map((item, indexImage) =>
                                        <Grid key={indexImage} item xs={getGridWidth(indexImage)}>
                                            <CardMedia
                                                component="img"
                                                height={images.length < 3 ? 140 : 70}
                                                image={item}
                                                alt={`recipe_pic_${indexImage}`}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>

                            <CardContent>
                                <Typography gutterBottom variant="h5">
                                    {book.name}
                                </Typography>
                            </CardContent>
                            </Box>
                        </Link>
                    </Card>
                </Grid>;
            })}
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