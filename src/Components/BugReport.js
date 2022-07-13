import * as React from 'react';
import {useState, useEffect} from "react";
import {Stack, Typography} from "@mui/material";
import {Modal, TextField, Paper, makeStyles, Button} from "@material-ui/core";
import { Octokit } from "@octokit/core";
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { getAuth } from './bugSubmitAuth';

const useStyles = makeStyles( {
    inputField: {
        width: '100%',
    },
    buttons: {
        marginTop: "20px",
        width: "100%",
        justifyContent: "center",
        alignContent: "center"
    },
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        padding: '30px'
    },
    title: {
        marginBottom: "10px",
        width: "100%"
    }
});

export default function BugReport(props) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);

    useEffect(() => {
        const numberOfWords = description.split(" ").length;
        setDisableSubmit(!(numberOfWords > 3) || description === '');
    }, [description])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function updateDescription(event) {
        const input = event.target.value;
        setDescription(input);
    }

    async function sendGitHub() {

        const octokit = new Octokit({
            auth: getAuth()
        })

        await octokit.request('POST /repos/Project-Sustain/athena/issues', {
            owner: 'Project-Sustain',
            repo: 'athena',
            title: `Bug Report: ${description.split(" ").slice(0, 3).join(" ")}...`,
            body: description,
            labels: [
                'bug', 'userSubmitted'
            ]
        })

    }

    return (
        <div>
            <Button variant='outlined' onClick={handleOpen}><BugReportIcon/>&nbsp;Report Bug</Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Paper className={classes.paper}>
                    <div className={classes.title}>
                        <Typography variant="h6" component="h2" textAlign="center">
                            Submit a Bug Report
                        </Typography>
                    </div>
                    <TextField
                        className={classes.inputField}
                        multiline
                        rows={6}
                        label="Please describe the issue you are noticing..."
                        value={description}
                        variant="outlined"
                        onChange={(event) => updateDescription(event)}
                    />
                    <Stack direction='row' spacing={2} className={classes.buttons}>
                        <Button disabled={disableSubmit} variant='outlined' onClick={() => {
                            sendGitHub().then(() => {
                                setDescription("");
                                handleClose();
                                props.setAlert(true);
                            });
                        }}><SendIcon/>&nbsp;Submit Bug</Button>
                        <Button variant='outlined' onClick={handleClose}><CloseIcon/></Button>
                    </Stack>
                </Paper>
            </Modal>
        </div>
    )

}
