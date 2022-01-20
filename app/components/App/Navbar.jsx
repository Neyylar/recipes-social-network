import React from "react";
import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@material-ui/core";

const Navbar = () =>{
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        {/*<MenuIcon />*/}
                    </IconButton>
                    <Button color="inherit" href={'/recipes/'}>Recipes</Button>
                    <Button color="inherit" href={'/recipes/'}>Recipe book</Button>
                    <Button color="inherit" href={'/login'}>Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;