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
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    function buildDropdownOptions() {
        const data = props.data;
        console.log({data})
        const options = props.data.map((option) => {
            return option.name;
        })
        return options
    }

    const options = buildDropdownOptions();

    return (
        <Box sx={{ minWidth: "40%" }} className={classes.root}>
            <FormControl fullWidth>
                <InputLabel>{props.name}</InputLabel>
                <Select
                    value={age}
                    label={props.name}
                    onChange={handleChange}
                >
                    {options.map((option, index) => {
                        return <MenuItem key={index} value={index}>{option}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        </Box>
    );
}