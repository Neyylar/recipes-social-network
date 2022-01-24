import {GridOverlay} from "@material-ui/data-grid";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";

const LoadingOverlay = () =>
    <GridOverlay>
        <Box position={"absolute"} top={0} width={"100%"}>
            <LinearProgress/>
        </Box>
    </GridOverlay>

export default LoadingOverlay;