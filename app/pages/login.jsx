import * as React from 'react';
import Box from "@material-ui/core/Box";
import {TextField} from "@material-ui/core";

const LoginForm = () => {
    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    required
                    id="outlined-required"
                    label="Login"
                />
                <TextField
                    required
                    id="outlined-required"
                    label="Password"
                />

            </div>
        </Box>
    );
}

export default LoginForm;