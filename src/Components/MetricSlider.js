import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import {makeStyles} from "@material-ui/core";
// import VolumeUp from '@mui/icons-material/VolumeUp';

const Input = styled(MuiInput)`
  width: 42px;
`;

const useStyles = makeStyles( {
    root: {

    },
    text_box: {
        // minWidth: "25px",
    },
});

export function MetricSlider(props) {
    const classes = useStyles();
    const handleSliderChange = (event, newValue) => {
        props.set(newValue);
    };

    const handleInputChange = (event) => {
        props.set(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (props.value < props.min) {
            props.set(props.min);
        } else if (props.value > props.max) {
            props.set(props.max);
        }
    };

    return (
        <Box component="span" sx={{width: '85%'}} >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Typography align="center">{props.label} {props.value}</Typography>
                    <Slider
                        onChange={handleSliderChange}
                        max={props.max}
                        min={props.min}
                        step={props.stepRate}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
