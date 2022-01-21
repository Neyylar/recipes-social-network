import React, {useCallback, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import {CardMedia, CircularProgress} from "@material-ui/core";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";
import Backdrop from "@material-ui/core/Backdrop";
import AddIcon from "@material-ui/icons/Add";
import MaterialLink from "@material-ui/core/Link";
import {Delete} from "@material-ui/icons";
import Image from 'next/image';
import baseConfig from "../../base.config";

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
        router = useRouter(),
        {enqueueSnackbar} = useSnackbar(),
        [loading, setLoading] = useState(false),
        [showTextInputErrors, setShowTextInputErrors] = useState(false),
        [pictures, setPictures] = useState([]),
        [tmpPicture, setTmpPicture] = useState(''),
        [name, setName] = useState(''),
        [description, setDescription] = useState(''),
        [steps, setSteps] = useState(''),
        [portions, setPortions] = useState(''),
        [phoneError, setPhoneError] = useState(false);

    const onSubmit = useCallback(event => {
        event.preventDefault();
        if (loading) return;
        const input = {
            name, description, steps, portions
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
                console.log(response);
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, [name, description, steps, portions, setLoading, loading]);

    const addPictureToArr = useCallback(() => {
        pictures.push(tmpPicture);
        setPictures(pictures);
        setTmpPicture('');
    }, [setPictures, pictures, tmpPicture, setTmpPicture]);

    const deletePicture = useCallback((index) => {
        const newArr = [...pictures];
        newArr.splice(index, 1);
        setPictures(newArr);
    }, [setPictures, pictures]);

    return (
        <Box>
            <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box>
                            <img
                                height="200"
                                src={pictures.length > 0 ? pictures[0] : 'https://homechef.imgix.net/https%3A%2F%2Fasset.homechef.com%2Fuploads%2Fmeal%2Fplated%2F4896%2Fsalad4-aa062b86fac073f5d983645756d63818-aa062b86fac073f5d983645756d63818.png?ixlib=rails-1.1.0&w=850&auto=format&s=8d75ce0c54a1a9273ea19d8a8d254a12'}
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
                                        onClick={addPictureToArr}><AddIcon/></Button>
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
                                                          color={"secondary"}>{item}</MaterialLink>
                                        </Typography>
                                        <Button onClick={() => deletePicture(index)} variant={'contained'} size={'small'}
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