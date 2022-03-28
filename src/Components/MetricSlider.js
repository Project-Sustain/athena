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
    text_box: {
        minWidth: "25px",
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
        <Box component="span" sx={{width: '100%'}} >
            <Typography id="input-slider" gutterBottom>
                {props.label}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={props.value}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        max={props.max}
                        min={props.min}
                        valueLabelDisplay="auto"
                        step={props.stepRate}
                    />
                </Grid>
                <Grid>
                    <Input
                        style ={{width: '100%'}}
                        value={props.value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: props.stepRate,
                            min: props.min,
                            max: props.max,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
