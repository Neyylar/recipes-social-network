import React, {useCallback, useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Typography
} from "@material-ui/core";
import moment from "moment"
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import baseConfig from "../../base.config";

const useStyles = makeStyles((theme) => ({
    paper1: {
        padding: '12px'
    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1
    }
}));

const EntityEditorDialog = ({entity, routeName, open, onSuccessVerify, handleClose, ...props}) => {
    const classes = useStyles(),
        {enqueueSnackbar} = useSnackbar(),
        [loading, setLoading] = useState(false),
        [name, setName] = useState(''),
        isEditing = entity && entity.id !== -1;

    useEffect(() => {
        if (entity) {
            setName(entity.name);
        }
    }, [entity]);

    const submitChanges = useCallback(event => {
        event.preventDefault();
        if (loading) return;
        const input = {
            name,
        };
        const submitData = async () => {
            let response;
            if (isEditing) {
                response = await fetch(`${baseConfig.server.url}/${routeName}/${entity.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(input),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            } else {
                response = await fetch(`${baseConfig.server.url}/${routeName}`, {
                    method: 'POST',
                    body: JSON.stringify(input),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }
            return await response.json();
        }
        setLoading(true);
        submitData()
            .then(response => {
                if (response) {
                    if (onSuccessVerify) onSuccessVerify(response);
                    enqueueSnackbar(`${response.name} created Successfully!`, {variant: 'success'});
                    handleClose();
                }
            })
            .catch(e => {
                console.error(e);
                enqueueSnackbar(e.toString(), {variant: 'error'});
            })
            .finally(() => setLoading(false));
    }, [name, setLoading, loading, onSuccessVerify, handleClose, isEditing, entity, routeName]);

    return <Dialog fullWidth maxWidth={"sm"} aria-labelledby={"user-verify-dialog"} scroll={"body"} open={open}
                   onClose={() => {
                       if (!loading) handleClose();
                   }} {...props}>
        <DialogTitle id={"user-verify-dialog"}>{isEditing ? 'Edit' : 'Create'} {routeName}</DialogTitle>
        <DialogContent>
            <Paper variant={"outlined"} className={classes.paper1}>
                <Grid container spacing={3}>
                    {isEditing &&
                        <Grid item xs={12}>
                            <Typography variant={"caption"}>Created at: </Typography>
                            <Typography>{moment(entity.createdAt).format('L')} at {moment(entity.createdAt).format('LT')}</Typography>
                        </Grid>}
                    <Grid item xs={12}>
                        <TextField value={name} onChange={event => setName(event.target.value)}
                                   disabled={loading} required label={"Name"} type={"text"} name={"name"}
                                   autoComplete={"fname"} variant={"outlined"} fullWidth/>
                    </Grid>
                </Grid>
            </Paper>
        </DialogContent>
        <DialogActions>
            <Button color={"secondary"} disabled={loading} onClick={handleClose}>Cancel</Button>
            <Button color={"secondary"} disabled={loading || name.length < 3}
                    onClick={submitChanges}>
                {loading ? 'Loading...' : 'Save'}
            </Button>
        </DialogActions>
        <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="primary"/>
        </Backdrop>
    </Dialog>
};

export default EntityEditorDialog;