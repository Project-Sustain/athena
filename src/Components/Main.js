import * as React from 'react';
import {makeStyles} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Dropdown from "./Dropdown";
import {metadata} from "../metadata";

const useStyles = makeStyles( {
    root: {
        width: "50%",
    },
});

export default function Main() {

    const frameworks = metadata.model_framework;
    const collections = metadata.collection;
    const resolution = metadata.spatial_field;
    const validation_budget = metadata.validation_budget;
    console.log({metadata});

    const classes = useStyles;
    return (
        <div className={classes.root}>
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <Dropdown name="Framework" data={frameworks} />
                <Dropdown name="Dataset" data={collections} />
            </Stack>
        </div>
    )
}