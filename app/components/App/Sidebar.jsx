import React, {Fragment, useCallback, useState} from 'react';
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import {makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import {useRouter} from "next/router";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';
import AddIcon from "@material-ui/icons/Add";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import {AccountCircle, Class, LocalOffer, MenuBook, Restaurant} from "@material-ui/icons";
import {useSnackbar} from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

const useStyles = makeStyles(theme => ({
    drawerPaper: {
        width: "260px"
    },
    logo: {
        width: '36px',
        height: '36px',
        marginRight: '12px',
        backgroundImage: `url(/android-chrome-192x192.png)`,
        backgroundSize: 'contain',
        WebkitBoxShadow: '0px 0px 8px 0px #757F9A',
        boxShadow: '0px 0px 8px 0px #757F9A',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    childMenu: {
        paddingLeft: '32px',
        '& .MuiListItemIcon-root': {
            minWidth: '40px'
        }
    }
}));

const Nav = ({onMenuShow, ...props}) => {
    const theme = useTheme(),
        router = useRouter(),
        classes = useStyles(),
        {enqueueSnackbar} = useSnackbar(),
        [loading, setLoading] = useState(false),
        [showSessionMenu, setShowSessionMenu] = useState(null),
        isLg = useMediaQuery(theme.breakpoints.up('lg'));

    return(
        <AppBar {...props}>
            <Toolbar>
                {!isLg &&
                    <Box mr={"12px"}>
                        <IconButton style={{color: '#fff'}} onClick={onMenuShow}>
                            <MenuIcon/>
                        </IconButton>
                    </Box>}
                <Typography variant="h6">Recipes Network</Typography>
                <Box ml={"auto"}>
                    <IconButton
                        style={{padding: 0}}
                        aria-controls="nav-session-menu"
                        aria-haspopup="true" color={"inherit"}
                        onClick={(e) => setShowSessionMenu(e.currentTarget)}
                    >
                        <AccountCircle/>
                    </IconButton>
                </Box>
            </Toolbar>
            <Backdrop open={loading} className={classes.backdrop}>
                <CircularProgress color={"primary"}/>
            </Backdrop>
        </AppBar>
    );
}

const Sidebar = ({children}) => {
    const classes = useStyles(),
        router = useRouter(),
        theme = useTheme(),
        isLg = useMediaQuery(theme.breakpoints.up('lg')),
        [open, setOpen] = useState(false),
        [show, setShow] = useState({
            recipes: true, recipesBook: true
        });

    const handleDrawerToggle = useCallback(() => {
        setOpen(!open);
    }, [open, setOpen]);

    return <Box display={"flex"} minHeight={"100vh"} width={"100%"}>
        <Drawer variant={isLg ? "permanent" : "temporary"} open={isLg || open} onClose={handleDrawerToggle} classes={{
            paper: classes.drawerPaper
        }}>
            <Box overflow={"auto"} mt={isLg ? "48px" : undefined}>
                {
                    !isLg &&
                    <Box my={"12px"}>
                        <Button fullWidth onClick={() => setOpen(false)} color={"primary"}>
                            Cerrar menú
                        </Button>
                    </Box>
                }
                <List>
                    <Link href={"/"} passHref scroll>
                        <ListItem button selected={router.pathname === '/'} onClick={() => setOpen(false)}>
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Home"}/>
                        </ListItem>
                    </Link>
                    <ListItem button onClick={() => setShow({...show, recipes: !show.recipes})}>
                        <ListItemIcon>
                            <Restaurant/>
                        </ListItemIcon>
                        <ListItemText primary="Recipes" />
                        {show.recipes ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={show.recipes} timeout="auto" unmountOnExit>
                        <>
                            <Link href={"/recipes"} passHref scroll>
                                <ListItem
                                    className={classes.childMenu}
                                    button
                                    selected={router.pathname === '/recipes'}
                                    onClick={() => setOpen(false)}
                                >
                                    <ListItemIcon>
                                        <ListIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Explore recipes"}/>
                                </ListItem>
                            </Link>
                            <Link href={"/recipes/create"} passHref scroll>
                                <ListItem
                                    className={classes.childMenu}
                                    button
                                    selected={router.pathname === '/recipes/create'}
                                    onClick={() => setOpen(false)}
                                >
                                    <ListItemIcon>
                                        <AddIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Create recipe"}/>
                                </ListItem>
                            </Link>
                            <Divider/>
                        </>
                    </Collapse>
                    <ListItem button onClick={() => setShow({...show, recipesBook: !show.recipesBook})}>
                        <ListItemIcon>
                            <MenuBook/>
                        </ListItemIcon>
                        <ListItemText primary="Recipe books"/>
                        {show.recipesBook ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={show.recipesBook} timeout="auto" unmountOnExit>
                        <Fragment>
                            <Link href={"/recipes-books"} passHref scroll>
                                <ListItem
                                    className={classes.childMenu}
                                    button
                                    selected={router.pathname === '/recipes-books'}
                                    onClick={() => setOpen(false)}
                                >
                                    <ListItemIcon>
                                        <ListIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Explore recipe books"}/>
                                </ListItem>
                            </Link>
                            <Link href={"/recipes-books/create"} passHref scroll>
                                <ListItem
                                    className={classes.childMenu}
                                    button
                                    selected={router.pathname === '/recipes-books/create'}
                                    onClick={() => setOpen(false)}
                                >
                                    <ListItemIcon>
                                        <AddIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Create recipe books"}/>
                                </ListItem>
                            </Link>
                            <Divider/>
                        </Fragment>
                    </Collapse>
                    <Link href={"/categories"} passHref scroll>
                        <ListItem button selected={router.pathname === '/categories'} onClick={() => setOpen(false)}>
                            <ListItemIcon>
                                <Class/>
                            </ListItemIcon>
                            <ListItemText primary={"Categories"}/>
                        </ListItem>
                    </Link>
                    <Link href={"/hashtags"} passHref scroll>
                        <ListItem button selected={router.pathname === '/hashtags'} onClick={() => setOpen(false)}>
                            <ListItemIcon>
                                <LocalOffer/>
                            </ListItemIcon>
                            <ListItemText primary={"Hashtags"}/>
                        </ListItem>
                    </Link>
                </List>
            </Box>
        </Drawer>
        <Box flex={1} maxWidth={"100%"} ml={isLg ? '260px' : undefined} pt={"64px"}>
            {children}
        </Box>
        <Nav onMenuShow={() => setOpen(true)}/>
    </Box>
}

export default Sidebar;