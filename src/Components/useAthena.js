import * as React from 'react';
import {Button, makeStyles} from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Dropdown from "./Dropdown";
import {metadata} from "../metadata";
import {useEffect, useState} from "react";
import {mongoQuery} from "./Utils/Download.ts";
import CheckboxSection from "./CheckboxSection";
import {Input, styled} from "@mui/material";


export function useAthena() {
    // console.log({chosenLabel});

    const [validationData, setValidationData] = useState({});
    const [modelCategory, setModelCategory] = useState("");
    const [modelFramework, setModelFramework] = useState("");

    const [collection, setCollection] = useState("")
    const [features, setFeatures] = useState([]);
    const [labels, setLabels] = useState(""); //Represents the variable of interest
    const [chosenFeatures, setChosenFeatures] = useState([]);
    const [chosenLabel, setChosenLabel] = useState("");

    const [validationMetric, setValidationMetric] = useState("")
    const [normalizeInputs, setNormalizeInput] = useState("true")
    const [budgetLimit, setBudgetLimit] = useState(0)
    const [sampleRate, setSampleRate] = useState(0.0)
    console.log({chosenLabel});


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

    function updateCollection(name){
        const targetCollection = validationData.supported_collections.values.filter((value) => value.name === name)[0]
        setCollection(name)
        setFeatures(targetCollection.features)
        setLabels(targetCollection.labels)
        setChosenFeatures([])
        setChosenLabel("")
    }

    const data = {
        validationData,
        modelCategory,
        modelFramework,
        collection,
        features,
        labels,
        validationMetric,
        normalizeInputs,
        budgetLimit,
        sampleRate,
        chosenLabel,
        chosenFeatures
    }

    const dataManagement = {
        setCollection,
        setValidationData,
        setModelCategory,
        setModelFramework,
        updateCollection: (name) => updateCollection(name),
        setValidationMetric,
        setNormalizeInput,
        setBudgetLimit,
        setSampleRate,
        setChosenLabel,
        setChosenFeatures
    }

    return {data, dataManagement};
}