import React, {useState} from "react";
import Container from "@material-ui/core/Container";
import Head from "next/head";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "next/link";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow, useTheme
} from "@material-ui/core";
import baseConfig from "../base.config";
import {makeStyles} from "@material-ui/core/styles";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const useStyles = makeStyles((theme) => ({

}));
const CategoriesPage = ({initialData}) => {
    const theme = useTheme();
    const classes = useStyles(),
        [categories, setCategories] = useState(initialData ? initialData.categories : []);

    return <Container maxWidth={'xl'} style={{}}>
        <Head>
            <title>recipes-network</title>
        </Head>
        <Box mb={"24px"}>
            <Breadcrumbs>
                <Link href={"/"} scroll passHref>
                    <MaterialLink>Dashboard</MaterialLink>
                </Link>
                <Typography>Categories</Typography>
            </Breadcrumbs>
        </Box>
        <Box ml={"30px"} mr={"30px"}>
            <TableContainer component={Paper}>
                <Table className={classes.table} variant="outlined" size="small" aria-label="a dense table">
                    <TableHead>

                    </TableHead>
                    <TableBody style={{backgroundColor: theme.palette.primary.main}}>
                        {categories.map((row) => (
                            <TableRow align="left">
                                <ArrowRightIcon />
                                <Typography variant="overline" color={"secondary"}>
                                    {row.name}
                                </Typography>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    </Container>

};

CategoriesPage.getInitialProps = async ({req}) => {
    try {
        const res = await fetch(`${baseConfig.server.url}/categories`);
        const categories = await res.json();
        return {
            initialData: {
                categories
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default CategoriesPage;
