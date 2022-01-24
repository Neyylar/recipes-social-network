import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, InputAdornment, TextField, useTheme} from "@material-ui/core";
import {useRouter} from "next/router";
import Box from "@material-ui/core/Box";
import {Search} from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import {DataGrid} from "@material-ui/data-grid";
import LoadingOverlay from "./LoadingOverlay";
import useDebounce from "./hooks/useDebounce";
import baseConfig from "../../base.config";
import querystring from "querystring";
import EntityEditorDialog from "./DefaultEditorDialog";

const useStyles = makeStyles((theme) => ({
    dataGrid: {
        '& .MuiDataGrid-row': {
            cursor: 'pointer'
        }
    },
}));

const DefaultTablePage = ({initialData, routeName}) => {

    const classes = useStyles(),
        theme = useTheme(),
        router = useRouter(),
        [loading, setLoading] = useState(false),
        [data, setData] = useState(initialData),
        [query, setQuery] = useState(''),
        [entityEditing, setEntityEditing] = useState(null);

    const debouncedQuery = useDebounce(query, 500);

    const columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: false,
        },
    ];

    const fetchAll = useCallback(() => {
        const fetchData = async () => {
            const response = await fetch(`${baseConfig.server.url}/${routeName}?query=${debouncedQuery}`);
            return await response.json();
        }
        setLoading(true);
        fetchData()
            .then(response => {
                setData(response);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => setLoading(false));
    }, [setLoading, setData, debouncedQuery, routeName]);

    useEffect(() => {
        const _query = querystring.stringify({query});
        fetchAll();
        const url = `${router.pathname}?${_query}`;
        router.replace(url, url, {shallow: true});
    }, [debouncedQuery]);

    return <Box>
            <Grid container spacing={1} alignItems={'center'}>
                <Grid item xs={12} md={5} lg={4} xl={3}>
                    <TextField value={query} onChange={event => setQuery(event.target.value)} fullWidth variant={"outlined"}
                               type={"search"} placeholder={`Search ${routeName}...`} margin={"dense"} InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <Search color={debouncedQuery.length > 0 ? "primary" : "secondary"}/>
                        </InputAdornment>
                    }}/>
                </Grid>
                <Grid item>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"}>
                        <Button
                            color={"secondary"}
                            variant={'outlined'}
                            startIcon={<AddIcon/>}
                            onClick={() => setEntityEditing({id: -1, name: ''})}>
                            Create {routeName}</Button>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box style={{width: '100%'}}>
                        <DataGrid
                            loading={loading}
                            className={classes.dataGrid}
                            disableSelectionOnClick
                            autoHeight
                            disableColumnFilter
                            rows={data}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[20]}
                            components={{
                                LoadingOverlay
                            }}
                            onRowClick={({row}) => setEntityEditing(row)}
                        />
                    </Box>
                </Grid>
            </Grid>
            <EntityEditorDialog
                routeName={routeName}
                handleClose={() => setEntityEditing(null)}
                open={Boolean(entityEditing)}
                entity={entityEditing}
                onSuccessVerify={() => {
                    if (debouncedQuery) setQuery('');
                    fetchAll();
                }}
            />
        </Box>
}

export default DefaultTablePage;