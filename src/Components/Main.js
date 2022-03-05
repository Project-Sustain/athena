import * as React from 'react';
import {Button, makeStyles} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Dropdown from "./Dropdown";
import {metadata} from "../metadata";
import {useEffect, useState} from "react";
import {mongoQuery} from "./Utils/Download.ts";
import CheckboxSection from "./CheckboxSection";
import {Input, Paper, styled} from "@mui/material";
import {useAthena} from "./useAthena";
import {MetricSlider} from "./MetricSlider"


const useStyles = makeStyles( {
    root: {
        width: "50%",
        justifyContent: "center"
    },
    validateButton: {
       padding: "20px",
    },
    list: {
        maxHeight: "90vh",
        overflow: "auto"
    },
});

export default function Main() {
    const classes = useStyles;
    const job_mode = "asynchronous";
    const database = "sustaindb";

    const {data, dataManagement} = useAthena();
    const [uploadFile, setUploadFile] = useState({})
    const [valParameters, setValParameters] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(Object.keys(data.validationData).length === 0);
    }, [data.validationData]);

    // useEffect(() => {
    //     setLoading(data === undefined);
    // }, [data]);


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

        // job_mode default value = "asynchronous"

        // fetch(https://sustain.cs.colostate.edu:31415/validation_service/submit_validation_job, {
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

    console.log(data.validationData)
    console.log(data.validationMetric)

    if(loading) {
        return null;
    }
    else {
        return (
            <div>
                <div className={classes.root}>
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                        <Dropdown name="Model Categories" data={data.validationData.model_categories.values} set={dataManagement.setModelCategory}
                                  state={data.modelCategory}/>
                        <Dropdown name="Model Frameworks" data={data.validationData.model_frameworks.values} set={dataManagement.setModelFramework}
                                  state={data.modelFramework}/>
                        <Dropdown name="Supported Collections" data={data.validationData.supported_collections.values.map((value) => value.name)}
                                  set={dataManagement.updateCollection} state={data.collection}/>
                        <Paper style={{maxHeight: 250, overflow: 'auto'}}>
                            <CheckboxSection data={data.features} setChecked={dataManagement.setChosenFeatures} checked={data.chosenFeatures}/>
                        </Paper>
                        <Dropdown name="Select Label" data={data.labels} set={dataManagement.setChosenLabel} state={data.chosenLabel}/>
                        <MetricSlider label="Validation Budget(Limit): " min={data.validationData.validation_budgets.values[0].min}
                                      max={data.validationData.validation_budgets.values[0].max} set={dataManagement.setBudgetLimit}
                                      value={data.budgetLimit}/>
                        <MetricSlider label="Validation Budget(Sample): " min={data.validationData.validation_budgets.values[1].min}
                                      max={data.validationData.validation_budgets.values[1].max} set={dataManagement.setSampleRate}
                                      value={data.sampleRate}/>
                        <Dropdown name="Validation Metric" data={data.validationData.validation_metrics.values}
                                  set={dataManagement.setValidationMetric} state={data.validationMetric}/>
                    </Stack>
                </div>
                <div className="App">
                    <label htmlFor="zipUpload">
                        <Input
                            onInput={handleFileReader}
                            type="file"
                            name="Select Model"
                            id="zipUpload"
                            accept=".zip,.rar,.7zip"
                        />
                    </label>
                    <Button className={classes.validateButton} onClick={validateModel} variant="outlined">Validate
                        Model</Button>
                </div>
            </div>
        );
    }
}