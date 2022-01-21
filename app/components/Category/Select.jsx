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

const CategoriesSelect = ({
                           value,
                           onChange,
                           inputProps = {},
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

    const fetchCategories = useCallback(() => {
        const fetchData = async () => {
            const response = await fetch(`${baseConfig.server.url}/categories`);
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
        fetchCategories();
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
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" fullWidth label={"Search categories..."}
                           onKeyPress={(e) => {
                               e.key === 'Enter' && e.preventDefault();
                           }}
                />
            )}
            renderOption={(option) => {
                return (
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Book />
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

export default CategoriesSelect;