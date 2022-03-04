import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {makeStyles, MenuItem} from "@material-ui/core";

const useStyles = makeStyles( {
    root: {
        margin: "10px",
    },
});

export default function Dropdown(props) {
    const classes = useStyles();

    const handleChange = (event) => {
        props.set(event.target.value);
    };

    function buildDropdownOptions() {
        const data = props.data;
        const options = props.data.map((option) => {
            return option;
        })
        return options
    }

    const options = buildDropdownOptions();

    return (
        <Box sx={{ minWidth: "40%" }} className={classes.root}>
            <FormControl fullWidth>
                <InputLabel>{props.name}</InputLabel>
                <Select
                    value={props.state}
                    label={props.name}
                    onChange={handleChange}
                >
                    {options.map((option, index) => {
                        return <MenuItem key={index} value={option}>{option}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}