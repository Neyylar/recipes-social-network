import React from "react";
import Container from "@material-ui/core/Container";
import Head from "next/head";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import baseConfig from "../base.config";
import {makeStyles} from "@material-ui/core/styles";
import DefaultTablePage from "../components/App/DefaultTablePage";

const useStyles = makeStyles((theme) => ({
    dataGrid: {
        '& .MuiDataGrid-row': {
            cursor: 'pointer'
        }
    },
}));

const UtensilsPage = ({initialData}) => {

    return (
        <Container maxWidth={'xl'} style={{}}>
            <Head>
                <title>recipes-network</title>
            </Head>
            <Box mb={"24px"}>
                <Breadcrumbs>
                    <Link href={"/"} scroll passHref>
                        <MaterialLink>Dashboard</MaterialLink>
                    </Link>
                    <Typography>Utensils</Typography>
                </Breadcrumbs>
            </Box>
            <DefaultTablePage initialData={initialData ? initialData.utensils : []} routeName={'utensils'}/>
        </Container>
    );
};

UtensilsPage.getInitialProps = async (ctx) => {
    try {
        const _query = ctx.query ? (ctx.query.query ? ctx.query.query : '') : '';
        const res = await fetch(`${baseConfig.server.url}/utensils?query=${_query}`);
        const utensils = await res.json();
        return {
            initialData: {
                utensils
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default UtensilsPage;
