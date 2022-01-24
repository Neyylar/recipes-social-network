import React, {useCallback, useEffect, useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import {
    Badge,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    InputAdornment,
    TextField
} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import MaterialLink from "@material-ui/core/Link";
import baseConfig from "../../base.config";
import {FilterList, Search} from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import useDebounce from "../../components/App/hooks/useDebounce";
import {useRouter} from "next/router";
import querystring from "querystring";
import RecipesFilterDialog from "../../components/Recipe/FilterDialog";

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        fontWeight: 400,
    },
    title: {
        color: '#263238',
        fontSize: '24px'
    },
}));

const FILTERS_STATE = {
    query: '',
    hashtags: [],
    categories: [],
};

const RecipesPage = ({initialData}) => {

    const classes = useStyles(),
        router = useRouter(),
        [recipes, setRecipes] = useState(initialData ? initialData.recipes : []),
        [filters, setFilters] = useState(initialData ? initialData.filters : FILTERS_STATE),
        [loading, setLoading] = useState(false),
        [showFiltersDialog, setShowFiltersDialog] = useState(false);

    const debouncedQuery = useDebounce(filters.query, 500);

    const showFiltersBadge = filters.hashtags?.length > 0 || filters.categories?.length > 0 || filters.query !== '';

    const getUrlParams = () => {
        const _categories = filters.categories.map(item => item.id);
        const _hashtags = filters.hashtags.map(item => item.id);
        return querystring.stringify({query: filters.query, categories: _categories, hashtags: _hashtags});
    }

    const fetchAll = useCallback(() => {
        const fetchData = async () => {
            const response = await fetch(`${baseConfig.server.url}/recipes?${getUrlParams()}`);
            return await response.json();
        }
        setLoading(true);
        fetchData()
            .then(response => {
                setRecipes(response);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => setLoading(false));
    }, [setLoading, setRecipes, debouncedQuery]);

    useEffect(() => {
        fetchAll();
        const url = `${router.pathname}?${getUrlParams()}`;
        router.replace(url, url, {shallow: true});
    }, [debouncedQuery, filters.categories, filters.hashtags]);

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
            <Grid item xs={12}>
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={12} md={5} lg={4} xl={3}>
                        <TextField value={filters.query}
                                   onChange={event => setFilters({...filters, query: event.target.value})}
                                   fullWidth variant={"outlined"} type={"search"}
                                   placeholder={`Search recipes...`} margin={"dense"}
                                   InputProps={{
                                       startAdornment: <InputAdornment position="start">
                                           <Search color={debouncedQuery.length > 0 ? "primary" : "secondary"}/>
                                       </InputAdornment>
                                   }}/>
                    </Grid>
                    <Grid item>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"}>
                            <Badge color="secondary" variant="standard" invisible={!showFiltersBadge}>
                                <Button
                                    color={"secondary"}
                                    variant={'outlined'}
                                    startIcon={<FilterList/>}
                                    onClick={() => setShowFiltersDialog(true)}>
                                    Filters</Button>
                            </Badge>
                            <Box ml={2}>
                                <Link href={'/recipes/create'} passHref>
                                    <Button
                                        color={"secondary"}
                                        variant={'outlined'}
                                        startIcon={<AddIcon/>}
                                        onClick={() => {}}>
                                        Create recipe</Button>
                                </Link>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            {recipes.map((recipe, index) => <Grid key={index} item xs={4}>
                <Card sx={{maxWidth: 345}}>
                    <CardActionArea onClick={() => router.push(`/recipes/[id]`, `/recipes/${recipe.id}`)}>
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
                    </CardActionArea>
                </Card>
            </Grid>)}
        </Grid>
        <RecipesFilterDialog
            handleClose={() => setShowFiltersDialog(false)}
            open={showFiltersDialog}
            filters={filters}
            setFilters={setFilters}
        />
    </Container>

};

RecipesPage.getInitialProps = async ({req}) => {
    try {
        const _query = ctx.query ? (ctx.query.query ? ctx.query.query : '') : '';
        const res = await fetch(`${baseConfig.server.url}/recipes?query=${_query}`);
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
