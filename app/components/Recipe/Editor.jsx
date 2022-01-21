import React, {useCallback, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import {CircularProgress} from "@material-ui/core";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import Backdrop from "@material-ui/core/Backdrop";
import AddIcon from "@material-ui/icons/Add";

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

const RecipeCreator = () => {
    const classes = useStyles(),
        router = useRouter(), {enqueueSnackbar} = useSnackbar(), [loading, setLoading] = useState(false), [showTextInputErrors, setShowTextInputErrors] = useState(false), [pictures, setPictures] = useState([]), [tmpPicture, setTmpPicture] = useState(''), [name, setName] = useState(''), [description, setDescription] = useState(''), [steps, setSteps] = useState(''), [portions, setPortions] = useState(''), [phoneError, setPhoneError] = useState(false);

    const onSubmit = useCallback(event => {
        event.preventDefault();
        if (loading) return;
    }, []);

    const addPictureToArr = useCallback(() => {
        pictures.push(tmpPicture);
        setPictures(pictures);
        setTmpPicture('');
    }, [setPictures, pictures, tmpPicture, setTmpPicture]);

    return (
        <Box>
            <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <TextField value={tmpPicture} onChange={event => setTmpPicture(event.target.value)}
                                       error={showTextInputErrors}
                                       helperText={showTextInputErrors ? "It needs a picture!" : ""}
                                       required label={"Pictures"} type={"text"} name={"picture"}
                                       className={classes.nameInput}
                                       autoComplete={"fname"} variant={"outlined"} fullWidth/>
                            <Box ml={'8px'}>
                                <Button variant={"contained"} color={"primary"} className={classes.addPictureButton}
                                        onClick={() => addPictureToArr()}><AddIcon/></Button>
                            </Box>
                        </Box>
                        <Box display={'flex'}>
                            {pictures.map((item, index) => <Typography key={index}>{item}</Typography>)}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Box mb={2} display={'flex'} alignItems={'center'} flexDirection={'row'}>
                            <Typography variant={'subtitle2'}>Portions Amount</Typography>
                            <TextField value={portions} onChange={event => setPortions(event.target.value)}
                                       error={showTextInputErrors}
                                       helperText={showTextInputErrors ? "Should be a number!" : ""}
                                       required label={"Portions"} type={"number"} name={"portions"}
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
                                   required label={"Preparation steps"} type={"text"} name={"steps"}
                                   className={classes.nameInput}
                                   autoComplete={"fname"} variant={"outlined"} fullWidth multiline rows={4}/>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            disabled={loading || phoneError || showTextInputErrors} type={"submit"}
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