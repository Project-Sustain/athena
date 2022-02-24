import * as React from 'react';
import {Button, makeStyles} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Dropdown from "./Dropdown";
import {metadata} from "../metadata";
import {useEffect, useState} from "react";
import {mongoQuery} from "../Components/Utils/Download";


const useStyles = makeStyles( {
    root: {
        width: "50%",
        justifyContent: "center"
    },
    validateButton: {
       padding: "20px",
    },
});

export default function Main() {

    const frameworks = metadata.model_framework;
    const collections = metadata.collection;
    const resolution = metadata.spatial_field;
    const validation_budget = metadata.validation_budget;
    const validation_metric = metadata.validation_metric;

    const [uploadFile, setUploadFile] = useState({})
    const [valParameters, setValParameters] = useState({})

    useEffect(() => {
        (async () => {
            const mongoData = await mongoQuery("state_gis_join_metadata", []);
            if(mongoData){
                console.log({mongoData})
            }
            else {
                console.log("API call failure, data unavailable");
            }
        })();
    }, []);





    const handleFileReader = (event) => {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e) => {
            setUploadFile({data:reader.result.split(',').pop(),fileName:event.target.files[0].name})
        };
    }

    const validateModel = () => {
        const formData = new FormData()
        formData.append('file', uploadFile[0])
        formData.append('request', valParameters.stringify)

        // fetch('/saveImage', {
        //     method: 'POST',
        //     body: formData
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         // console.log(data)
        //     })
        //     .catch(error => {
        //         // console.error(error)
        //     })
    }

    const classes = useStyles;
    return (
        <div>
            <div className={classes.root}>
                <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                    <Dropdown name="Framework" data={frameworks} />
                    <Dropdown name="Dataset" data={collections} />
                </Stack>
            </div>
            <div className="App">
                <label htmlFor="zipUpload">
                <input
                    onChange={handleFileReader}
                    type="file"
                    name="Select Model"
                    id="zipUpload"
                    accept=".zip,.rar,.7zip"
                />
                </label>
                <Button className={classes.validateButton} onClick={validateModel} variant="outlined">Validate Model</Button>
            </div>
        </div>
    );
}