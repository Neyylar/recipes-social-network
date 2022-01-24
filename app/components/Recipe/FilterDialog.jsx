import React, {useCallback, useEffect, useState} from "react";
import {
    Backdrop, Box,
    Button, Chip,
    CircularProgress, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid, InputAdornment,
    Paper,
    Typography
} from "@material-ui/core";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import DefaultSelect from "../App/DefaultSelect";
import {Book, LocalOffer, RestaurantMenu, Search} from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import {useSnackbar} from "notistack";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
    paper1: {
        padding: '12px'
    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1
    },
    dialogActions: {
        justifyContent: 'space-between'
    },
    addPictureButton: {
        borderRadius: 25, padding: 8, minWidth: 24
    },
}));

const RecipesFilterDialog = ({filters, setFilters, open, handleClose, ...props}) => {

    const classes = useStyles(),
        {enqueueSnackbar} = useSnackbar(),
        [tmpQuery, setTmpQuery] = useState(filters.query),
        [categories, setCategories] = useState(filters.categories),
        [tmpCategory, setTmpCategory] = useState(null),
        [hashtags, setHashtags] = useState(filters.hashtags),
        [tmpHashtag, setTmpHashtag] = useState(null);

    const clearFilters = useCallback(() => {
        setFilters({
            query: '',
            hashtags: [],
            categories: [],
        });
        handleClose();
    }, [setFilters, handleClose]);

    const submitFilters = useCallback(() => {
        setFilters({
            query: tmpQuery,
            hashtags: hashtags,
            categories: categories,
        });
        handleClose();
    }, [setFilters, handleClose, tmpQuery, hashtags, categories]);

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

    useEffect(() => {
        setTmpQuery(filters.query ? filters.query : '');
        setCategories(filters.categories ? filters.categories : []);
        setHashtags(filters.hashtags ? filters.hashtags : []);
    }, [filters]);

    return (
        <Dialog fullWidth maxWidth={"sm"} aria-labelledby={"user-verify-dialog"} scroll={"body"} open={open}
                onClose={handleClose} {...props}>
            <DialogTitle id={"user-verify-dialog"}>Filter recipes</DialogTitle>
            <DialogContent>
                <Paper variant={"outlined"} className={classes.paper1}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField value={tmpQuery} onChange={event => setTmpQuery(event.target.value)} fullWidth variant={"outlined"}
                                       type={"search"} placeholder={`Search recipes...`} margin={"dense"} InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search color={tmpQuery.length > 0 ? "primary" : "secondary"}/>
                                </InputAdornment>
                            }}/>
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
                    </Grid>
                </Paper>
            </DialogContent>
            <DialogActions classes={{root: classes.dialogActions}}>
                <Button color={"secondary"} onClick={clearFilters}>Clear filters</Button>
                <Box>
                    <Button color={"secondary"} onClick={handleClose}>Cancel</Button>
                    <Button color={"secondary"} onClick={submitFilters}>
                        Save filters
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default RecipesFilterDialog;