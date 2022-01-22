import React, {useCallback, useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import moment from "moment";
import baseConfig from "../../base.config";
import useDebounce from "../App/hooks/useDebounce";
import {Book} from "@material-ui/icons";

const autocompleteService = {current: null};

const useStyles = makeStyles((theme) => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
    avatar: {
        width: '32px',
        height: '32px',
        marginRight: '10px',
        background: theme.palette.primary.main,
        color: '#fff'
    },
    title: {
        fontWeight: 'bold'
    },
    autocomplete: {
        margin: '16px 0',
        '& .MuiChip-root': {
            background: theme.palette.primary.main,
            color: '#fff'
        },
        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.main
        },

        '& .MuiChip-deleteIcon': {
            color: '#fff'
        },
    },
}));

const DefaultSelect = ({
                              value,
                              onChange,
                              inputProps = {},
                              fetchRoute,
                              customIcon = <Book/>,
                              withPictures,
                              variant = 'filled',
                              required = false,
                              used = [],
                              validated = null,
                              status = null,
                              ...props
                          }) => {
    const classes = useStyles(),
        [loading, setLoading] = useState(false),
        [inputValue, setInputValue] = useState(''),
        [options, setOptions] = useState([]);

    const debouncedInputValue = useDebounce(inputValue, 1000);

    const fetchOptions = useCallback(() => {
        const fetchData = async () => {
            const response = await fetch(`${baseConfig.server.url}/${fetchRoute}`);
            return await response.json();
        }
        setLoading(true);
        fetchData()
            .then(response => {
                setOptions(response);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => setLoading(false));
    }, [setLoading, setOptions]);

    useEffect(() => {
        fetchOptions();
    }, [debouncedInputValue]);

    return (
        <Autocomplete
            {...props}
            // multiple
            id="user-select"
            getOptionLabel={(option) => option.name}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            className={classes.autocomplete}
            includeInputInList
            filterSelectedOptions
            value={value}
            loading={loading}
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" fullWidth label={`Search ${fetchRoute}...`}
                           onKeyPress={(e) => {
                               e.key === 'Enter' && e.preventDefault();
                           }}
                />
            )}
            renderOption={(option) => {
                return (
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            {customIcon}
                            {withPictures &&
                                <img
                                    width="48"
                                    height="48"
                                    src={option.files?.length > 0 ? option.files[0].url : baseConfig.images.recipeDefault}
                                    alt={`recipe_pic_alt`}
                                    style={{marginRight: '8px'}}
                                />}
                        </Grid>
                        <Grid item xs>
                            <Typography className={classes.title} variant={"body1"}>
                                {option.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {moment(option.createdAt).format('L')}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}

export default DefaultSelect;