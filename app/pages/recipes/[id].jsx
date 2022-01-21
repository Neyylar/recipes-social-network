import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Head from "next/head";
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Grid,
    ListItem,
    ListItemText
} from "@material-ui/core";
import {useRouter} from "next/router";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";

const useStyles = makeStyles(theme => ({
    breadcrumb: {
        fontWeight: 400,
    },
    title: {
        color: '#263238',
        fontSize: '24px'
    },
}));

const RecipePage = ({initialData}) => {
    const { asPath } = useRouter();
    const classes = useStyles(),
        [recipe, setRecipe] = useState(initialData ? initialData.recipe : {});

    return <Container maxWidth={'xl'} style={{marginTop: '85px'}}>
        <Head>
            <title>recipes-network</title>
        </Head>
        <Button color="inherit" href={'/recipes/'}>Go back</Button>
            <Card sx={{maxWidth: 800}}>
                {recipe?.files.map((file, index) =>
                <CardMedia
                    component="img"
                    height="400"
                    image={file ? file.url : 'https://homechef.imgix.net/https%3A%2F%2Fasset.homechef.com%2Fuploads%2Fmeal%2Fplated%2F4896%2Fsalad4-aa062b86fac073f5d983645756d63818-aa062b86fac073f5d983645756d63818.png?ixlib=rails-1.1.0&w=850&auto=format&s=8d75ce0c54a1a9273ea19d8a8d254a12'}
                    alt={`${asPath}/${index}`}
                />)}

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {recipe?.name}
                    </Typography>
                    <Typography  variant="body2" color="text.secondary">
                        {recipe?.preparationTime}
                        {recipe?.portions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {recipe?.description}
                    </Typography>
                    <Box ml={'8px'} mt={'2px'}>
                        <Typography variant="body2" color="text.secondary">
                            {recipe?.steps}
                        </Typography>
                    </Box>
                    <Box mt ={'2px'}>
                        {recipe?.hashtags.map(({id, name}) =>
                            <Chip label={name}/>
                        )}
                    </Box>
                    <Box>
                        {recipe?.categories.map(({name}) =>
                            <Chip label={name}/>
                        )}
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <List>
                                {recipe?.products.map(({id, name}) =>
                                <ListItem disablePadding color={"primary"}>
                                    <ListItemText primary={name} />
                                </ListItem>
                                )}
                            </List>
                        </Grid>
                        <Grid item xs={6}>
                            <List>
                                {recipe?.utensils.map(({id, name}) =>
                                    <ListItem disablePadding color={"secondary"}>
                                        <ListItemText primary={name} />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                    </Grid>





                </CardContent>
            </Card>
    </Container>

};

RecipePage.getInitialProps = async (ctx) => {
    try {
        const id = ctx.query ? ctx.query.id : null;
        const res = await fetch(`http://localhost:4000/recipes/${id}`);
        const recipe = await res.json();
        return {
            initialData: {
                recipe
            }
        }
    } catch (error) {
        console.error(error);
    }
}

export default RecipePage;
