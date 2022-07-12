import * as React from 'react';
import {makeStyles, Modal} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Dropdown from "./Dropdown";
import {useEffect, useState} from "react";
import {mongoQuery} from "./Utils/Download.ts";
import CheckboxSection from "./CheckboxSection";
import {ButtonGroup, Paper, Button, CircularProgress, Box} from "@mui/material";
import {useAthena} from "./useAthena";
import {MapSection} from "./Map/MapSection";
import {request} from "./test_request";


const useStyles = makeStyles( {
    root: {
        width: "50%",
        justifyContent: "center"
    },
    buttons: {
        margin: "10px",
    },
    list: {
        maxHeight: "90vh",
        overflow: "auto"
    },
    paper: {
        width: "70%",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "auto",
        maxHeight: "85vh",
        padding: "10px"
    },
    checkboxPaper: {
        overflow: "auto",
        maxHeight: "30vh",
        width: "85%"
    },
});

export default function Main() {
    const classes = useStyles();
    const {data, dataManagement} = useAthena();
    const [uploadFile, setUploadFile] = useState({})
    const [valParameters, setValParameters] = useState({})
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setLoading(Object.keys(data.validationData).length === 0);
    }, [data.validationData]);

    const handleFileSubmission = (event) => {
        setUploadFile(event.target.files[0]);
    }

    // const validateModel = () => {
    //     const formData = new FormData()
    //     formData.append('file', uploadFile[0])
    //     formData.append('request', valParameters.stringify)
    // }

    async function sendRequest(){
        console.log({request})
        const formData = new FormData();
        const url = "http://lattice-100.cs.colostate.edu:5000/validation_service/submit_validation_job";
        formData.append('file', uploadFile);
        console.log(uploadFile)
        //valParameters.stringify
        console.log(JSON.stringify(request))
        formData.append('request', JSON.stringify(request));

        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            body: formData,
        });
        const reader = response.body.getReader();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            console.log('Received', value);
        }

        console.log('Response fully received');
    }

    if (loading) {
       return (
           <Box >
               <CircularProgress />
           </Box>
       );

    } else {
        return (
            <div>
                <MapSection/>
                <Button onClick={handleOpen}>Open modal</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <>
                        <Paper className={classes.paper}>
                            <div>
                                <Stack direction="column" justifyContent="center" alignItems="center">
                                    <Dropdown name="Model Frameworks"
                                        data={data.validationData.model_frameworks.values.map((value) => value.human_readable)}
                                        set={dataManagement.setModelFramework}
                                        state={data.modelFramework}/>
                                    <Dropdown name="Model Categories"
                                              data={data.validationData.model_categories.values.map((value) => value.human_readable)}
                                              set={dataManagement.setModelCategory}
                                              state={data.modelCategory}/>
                                    <Dropdown name="Supported Collections"
                                              data={data.validationData.supported_collections.values.map((value) => value.name)}
                                              set={dataManagement.updateCollection} state={data.collection}/>
                                    {renderFeatures()}
                                    <Dropdown name="Select Label" data={data.labels} set={dataManagement.setChosenLabel}
                                              state={data.chosenLabel}/>
                                    <Dropdown name="Validation Metric"
                                              data={data.validationData.validation_metrics.values.map((value) => value.human_readable)}
                                              set={dataManagement.setValidationMetric} state={data.validationMetric}/>
                                    <Dropdown name="Spatial Resolution"
                                              data={data.validationData.spatial_resolutions.values.map((value) => value.human_readable)}
                                              set={dataManagement.setValidationMetric} state={data.validationMetric}/>
                                    <ButtonGroup className={classes.buttons} variant="outlined">
                                        <Button component="label">Upload a file<input type="file" hidden onChange={handleFileSubmission}/></Button>
                                        <Button onClick={() => sendRequest()}>Validate Model</Button>
                                    </ButtonGroup>
                                </Stack>
                            </div>
                        </Paper>
                    </>
                </Modal>
            </div>
        );
    }

    function renderFeatures() {
        if (data.collection === "") {
            return null;
        } else {
            return (
                <Paper className={classes.checkboxPaper}>
                    <CheckboxSection data={data.features} setChecked={dataManagement.setChosenFeatures}
                                     checked={data.chosenFeatures}/>
                </Paper>
            )

        }
    }
}
