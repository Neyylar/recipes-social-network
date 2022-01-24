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
    },
    emailInput: {
        '& input': {
            textTransform: 'lowerCase'
        }
    },
    addPictureButton: {
        borderRadius: 25, padding: 8, minWidth: 24
    },
    submitButton: {
        width: '100%'
    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1
    }
}));

const RecipeCreator = () => {
    const classes = useStyles(),
        router = useRouter(),
        {enqueueSnackbar} = useSnackbar(),
        [loading, setLoading] = useState(false),
        [showTextInputErrors, setShowTextInputErrors] = useState(false),
        [pictures, setPictures] = useState([]),
        [tmpPicture, setTmpPicture] = useState(''),
        [name, setName] = useState(''),
        [description, setDescription] = useState(''),
        [steps, setSteps] = useState(''),
        [portions, setPortions] = useState(1),
        [categories, setCategories] = useState([]),
        [tmpCategory, setTmpCategory] = useState(null),
        [hashtags, setHashtags] = useState([]),
        [tmpHashtag, setTmpHashtag] = useState(null),
        [utensils, setUtensils] = useState([]),
        [tmpUtensil, setTmpUtensil] = useState(null),
        [products, setProducts] = useState([]),
        [tmpProduct, setTmpProduct] = useState(null);

    const validInputs = pictures.length > 0 && name.length > 3;

    const onSubmit = useCallback(event => {
        event.preventDefault();
        if (loading) return;
        const input = {
            name,
            description,
            steps,
            portions,
            files: pictures,
            hashtags: hashtags.map(({id}) => id),
            categories: categories.map(({id}) => id),
            utensils: utensils.map(({id}) => id),
        };
        const submitData = async () => {
            const response = await fetch(`${baseConfig.server.url}/recipes`, {
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
                    enqueueSnackbar(`Receta ${response.name} created Successfully!`, {variant: 'success'});
                    router.replace('/recipes/[id]',`/recipes/${response.id}`);
                }
            })
            .catch(e => {
                console.error(e);
                enqueueSnackbar(e.toString(), {variant: 'error'});
            })
            .finally(() => setLoading(false));
    }, [name, description, steps, portions, setLoading, loading, pictures, hashtags, categories, utensils]);

    const deleteItemFromArr = (itemIndex, arr, setArr) => {
        const newArr = [...arr];
        newArr.splice(itemIndex, 1);
        setArr(newArr);
    }
    const addItemToArr = (newItem, arr, setArr) => {
        if (!newItem) return;
        if (typeof newItem === 'object') {
            if (arr.find(item => item.id === newItem.id)) {
                enqueueSnackbar(`This item was already added.`, {variant: 'warning'});
                return;
            }
        } else {
            if (arr.includes(newItem)) {
                enqueueSnackbar(`This item was already added.`, {variant: 'warning'});
                return;
            }
        }
        arr.push(newItem);
        setArr(arr);
    }

    return (
        <Box>
            <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box>
                            <img
                                height="200"
                                src={pictures.length > 0 ? pictures[0] : baseConfig.images.recipeDefault}
                                alt={`recipe_pic_alt`}
                            />
                        </Box>

                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <TextField value={tmpPicture} onChange={event => setTmpPicture(event.target.value)}
                                       error={showTextInputErrors}
                                       helperText={showTextInputErrors ? "It needs a picture!" : ""}
                                       label={"Pictures"} type={"text"} name={"picture"}
                                       className={classes.nameInput}
                                       autoComplete={"fname"} variant={"outlined"} fullWidth/>
                            <Box ml={'8px'}>
                                <Button variant={"contained"} color={"primary"} className={classes.addPictureButton}
                                        onClick={() => {
                                            addItemToArr(tmpPicture, pictures, setPictures);
                                            setTmpPicture('');
                                        }}><AddIcon/></Button>
                            </Box>
                        </Box>
                        {pictures.length > 0 &&
                            <Box display={'flex'} flexDirection={'column'} px={'4px'}
                                 py={'8px'} mt={'8px'} borderRadius={8} border={1} borderColor={'primary'}
                            >
                                {pictures.map((item, index) =>
                                    <Box key={index} display={'flex'} flexDirection={'row'} alignItems={'center'}
                                         justifyContent={'space-between'}
                                         borderTop={index === 0 ? 0 : 1} borderColor={'primary'} py={'4px'}>
                                        <Typography component={"p"}>
                                            <MaterialLink target={"_blank"} href={item}
                                                          color={"secondary"} style={{wordBreak: 'break-word'}}>{item}</MaterialLink>
                                        </Typography>
                                        <Button onClick={() => deleteItemFromArr(index, pictures, setPictures)} variant={'contained'} size={'small'}
                                                color={'primary'}><Delete/></Button>
                                    </Box>)}
                            </Box>}
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box mb={2} display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <Typography variant={'subtitle2'}>Portions Amount</Typography>
                            <TextField value={`${portions}`} onChange={event => setPortions(parseInt(event.target.value))}
                                       error={showTextInputErrors}
                                       helperText={showTextInputErrors ? "Should be a number!" : ""}
                                       required label={"Portions"}
                                       InputProps={{ inputProps: { min: 1, max: 50 } }}
                                       type={"number"}
                                       name={"portions"}
                                       className={classes.nameInput}
                                       autoComplete={"fname"} variant={"outlined"} fullWidth/>
                        </Box>
                        <Box mb={2}>
                            <TextField value={name} onChange={event => setName(event.target.value)}
                                       error={showTextInputErrors}
                                       helperText={showTextInputErrors ? "Max 40 characters" : ""}
                                       required label={"Name"} type={"text"} name={"name"} className={classes.nameInput}
                                       autoComplete={"fname"} variant={"outlined"} fullWidth/>
                        </Box>
                        <Box mb={2}>
                            <TextField value={description} onChange={event => setDescription(event.target.value)}
                                       error={showTextInputErrors}
                                       helperText={showTextInputErrors ? "" : ""}
                                       required label={"Description"} type={"text"} name={"description"}
                                       className={classes.nameInput}
                                       autoComplete={"fname"} variant={"outlined"} fullWidth multiline rows={2}/>
                        </Box>
                        <TextField value={steps} onChange={event => setSteps(event.target.value)}
                                   error={showTextInputErrors}
                                   helperText={showTextInputErrors ? "" : ""}
                                   label={"Preparation steps"} type={"text"} name={"steps"}
                                   className={classes.nameInput}
                                   autoComplete={"fname"} variant={"outlined"} fullWidth multiline rows={4}/>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <Box flex={1}>
                                <DefaultSelect
                                    fetchRoute={'categories'}
                                    customIcon={<Book/>}
                                    value={tmpCategory}
                                    onChange={setTmpCategory}
                                />
                            </Box>
                            <Box ml={'8px'}>
                                <Button variant={"contained"} color={"primary"} className={classes.addPictureButton}
                                        onClick={() => {
                                            addItemToArr(tmpCategory, categories, setCategories);
                                            setTmpCategory(null);
                                        }}><AddIcon/></Button>
                            </Box>
                        </Box>
                        {categories.length > 0 &&
                            <Box display={'flex'} flexDirection={'row'}>
                                {categories.map((item, index) => <Box key={index} mr={1}>
                                        <Chip label={item.name} onDelete={() => deleteItemFromArr(index, categories, setCategories)}/>
                                </Box>
                                )}
                            </Box>}
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <Box flex={1}>
                                <DefaultSelect
                                    fetchRoute={'hashtags'}
                                    customIcon={<LocalOffer/>}
                                    value={tmpHashtag}
                                    onChange={setTmpHashtag}
                                />
                            </Box>
                            <Box ml={'8px'}>
                                <Button variant={"contained"} color={"primary"} className={classes.addPictureButton}
                                        onClick={() => {
                                            addItemToArr(tmpHashtag, hashtags, setHashtags);
                                            setTmpHashtag(null);
                                        }}><AddIcon/></Button>
                            </Box>
                        </Box>
                        {hashtags.length > 0 &&
                            <Box display={'flex'} flexDirection={'row'}>
                                {hashtags.map((item, index) => <Box key={index} mr={1}>
                                        <Chip label={item.name} onDelete={() => deleteItemFromArr(index, hashtags, setHashtags)}/>
                                    </Box>
                                )}
                            </Box>}
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <Box flex={1}>
                                <DefaultSelect
                                    fetchRoute={'utensils'}
                                    customIcon={<RestaurantMenu/>}
                                    value={tmpUtensil}
                                    onChange={setTmpUtensil}
                                />
                            </Box>
                            <Box ml={'8px'}>
                                <Button variant={"contained"} color={"primary"} className={classes.addPictureButton}
                                        onClick={() => {
                                            addItemToArr(tmpUtensil, utensils, setUtensils);
                                            setTmpUtensil(null);
                                        }}><AddIcon/></Button>
                            </Box>
                        </Box>
                        {utensils.length > 0 &&
                            <Box display={'flex'} flexDirection={'row'}>
                                {utensils.map((item, index) => <Box key={index} mr={1}>
                                        <Chip label={item.name} onDelete={() => deleteItemFromArr(index, utensils, setUtensils)}/>
                                    </Box>
                                )}
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
                            {!loading && 'Create recipe'}
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

export default RecipeCreator;