import React, {useCallback, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import {Chip, CircularProgress} from "@material-ui/core";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import Backdrop from "@material-ui/core/Backdrop";
import AddIcon from "@material-ui/icons/Add";
import MaterialLink from "@material-ui/core/Link";
import {Book, Delete, LocalOffer, RestaurantMenu} from "@material-ui/icons";
import baseConfig from "../../base.config";
import DefaultSelect from "../App/DefaultSelect";

const useStyles = makeStyles((theme) => ({
    nameInput: {
        '& input': {
            textTransform: 'capitalize'
        }
    }, emailInput: {
        '& input': {
            textTransform: 'lowerCase'
        }
    }, addPictureButton: {
        borderRadius: 25, padding: 8, minWidth: 24
    }, submitButton: {
        width: '100%'
    }, backdrop: {
        zIndex: theme.zIndex.modal + 1
    }
}));

const RecipesBookCreator = () => {
    const classes = useStyles(),
        router = useRouter(),
        {enqueueSnackbar} = useSnackbar(),
        [loading, setLoading] = useState(false),
        [showTextInputErrors, setShowTextInputErrors] = useState(false),
        [name, setName] = useState(''),
        [recipes, setRecipes] = useState([]),
        [tmpRecipe, setTmpRecipe] = useState(null);

    const validInputs = recipes.length > 0 && name.length > 3;

    const onSubmit = useCallback(event => {
        event.preventDefault();
        if (loading) return;
        const input = {
            name,
            recipes: recipes.map(({id}) => id),
        };
        const submitData = async () => {
            const response = await fetch(`${baseConfig.server.url}/recipes-books`, {
                method: 'POST',
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return await response.json();
        }
        setLoading(true);
        submitData()
            .then(response => {
                if (response) {
                    enqueueSnackbar(`Recipes book ${response.name} created Successfully!`, {variant: 'success'});
                    router.replace('/recipes-books/[id]',`/recipes-books/${response.id}`);
                }
            })
            .catch(e => {
                console.error(e);
                enqueueSnackbar(e.toString(), {variant: 'error'});
            })
            .finally(() => setLoading(false));
    }, [name, setLoading, loading, recipes]);

    const deleteRecipe = useCallback((index) => {
        const newArr = [...recipes];
        newArr.splice(index, 1);
        setRecipes(newArr);
    }, [recipes, setRecipes]);

    const addRecipe = useCallback(() => {
        if (!tmpRecipe) return;
        if (recipes.find(item => item.id === tmpRecipe.id)) {
            enqueueSnackbar(`This item was already added.`, {variant: 'warning'});
            return;
        }
        recipes.push(tmpRecipe);
        setRecipes(recipes);
        setTmpRecipe(null);
    }, [recipes, setRecipes, tmpRecipe, recipes, setTmpRecipe]);

    return (
        <Box>
            <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box mb={1}>
                            <TextField value={name} onChange={event => setName(event.target.value)}
                                       error={showTextInputErrors}
                                       helperText={showTextInputErrors ? "Max 40 characters" : ""}
                                       required label={"Name"} type={"text"} name={"name"} className={classes.nameInput}
                                       autoComplete={"fname"} variant={"outlined"} fullWidth/>
                        </Box>

                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <Box flex={1}>
                                <DefaultSelect
                                    fetchRoute={'recipes'}
                                    customIcon={<Box>
                                        <img
                                            width="48"
                                            height="48"
                                            src={baseConfig.images.recipeDefault}
                                            alt={`recipe_pic_alt`}
                                        />
                                    </Box>}
                                    value={tmpRecipe}
                                    onChange={setTmpRecipe}
                                />
                            </Box>
                            <Box ml={'8px'}>
                                <Button variant={"contained"} color={"primary"} className={classes.addPictureButton}
                                        onClick={addRecipe}><AddIcon/></Button>
                            </Box>
                        </Box>
                        {recipes.length > 0 &&
                            <Box display={'flex'} flexDirection={'column'} px={'4px'}
                                 py={'8px'} mt={'8px'} borderRadius={8} border={1} borderColor={'primary'}
                            >
                                {recipes.map((item, index) =>
                                    <Box key={index} display={'flex'} flexDirection={'row'} alignItems={'center'}
                                         justifyContent={'space-between'}
                                         borderTop={index === 0 ? 0 : 1} borderColor={'primary'} py={'4px'}>
                                        <Typography component={"p"}>
                                            <MaterialLink target={"_blank"} href={item}
                                                          color={"secondary"} style={{wordBreak: 'break-word'}}>{item}</MaterialLink>
                                        </Typography>
                                        <Button onClick={() => deleteRecipe(index)} variant={'contained'} size={'small'}
                                                color={'primary'}><Delete/></Button>
                                    </Box>)}
                            </Box>}
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            disabled={loading || showTextInputErrors || !validInputs} type={"submit"}
                            disableElevation
                            className={classes.submitButton}
                            variant={"contained"} color={"primary"}
                        >
                            {!loading && 'Create recipes book'}
                            {loading && <Box display={"flex"} alignItems={"center"}>
                                <Box mr={"12px"} lineHeight={"18px"}>
                                    <CircularProgress size={18} className={classes.btnProgress}/>
                                </Box>
                                <Box>Cargando...</Box>
                            </Box>}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="primary"/>
            </Backdrop>
        </Box>);
}

export default RecipesBookCreator;