import * as React from 'react';
import {Button, makeStyles} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Dropdown from "./Dropdown";
import {metadata} from "../metadata";
import {useEffect, useState} from "react";
import {mongoQuery} from "./Utils/Download.ts";
import CheckboxSection from "./CheckboxSection";
import {Input, styled} from "@mui/material";


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
    const job_mode = "asynchronous";
    const database = "sustaindb";

    const [modelFrameWork, setModelFrameWork] = useState("");
    const [modelCategory, setModelCategory] = useState("");
    const [collection, setCollection] = useState("")
    const [features, setFeatures] = useState([]);
    const [label, setLabel] = useState(""); //Represents the variable of interest
    const [validationMetric, setValidationMetric] = useState("")
    const [normalizeInputs, setNormalizeInput] = useState("true")
    const [budgetLimit, setBudgetLimit] = useState(0)
    const [sampleRate, setSampleRate] = useState(0.0)

    // console.log({validationData})

    const [uploadFile, setUploadFile] = useState({})
    const [valParameters, setValParameters] = useState({})
    const [validationData, setValidationData] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(Object.keys(validationData).length === 0);
    }, [validationData]);

    useEffect(() => {
        (async () => {
            const validationData = await mongoQuery("validation_catalogue", []);
            if(validationData){
                setValidationData(validationData[0])

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
    // const Input = styled('input')({
    //     display: 'none',
    // });

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

    const classes = useStyles;

    if(loading) {
        return null;
    }
    else {
        console.log({collection})
        return (
            <div>
                <div className={classes.root}>
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                        <Dropdown name="Model Categories" data={validationData.model_categories.values} set={setModelCategory}/>
                        <Dropdown name="Model Frameworks" data={validationData.model_frameworks.values} set={setModelFrameWork}/>
                        <Dropdown name="Supported Collections" data={validationData.supported_collections.values.map((value) => value.name)}
                                  set={setCollection}/>
                        <CheckboxSection data={validationData.supported_collections.values.filter((value) => value.name === collection)[0]}
                                         setChecked={setFeatures} checked={features}/>
                        {/*<Dropdown name="Select Label" data={(validationData.supported_collections.values.filter((value) => value.name === collection)[0]).labels}*/}
                        {/*          set={setCollection}/>*/}
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