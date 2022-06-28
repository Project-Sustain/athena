import * as React from 'react';
import {useState} from "react";
import { makeStyles } from "@material-ui/core";
import {Button, Modal, Alert, Typography, TextField, Stack, Paper} from "@mui/material";
import { Octokit } from "@octokit/core";
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

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

export function BugForm(props) {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function updateDescription(event) {
        const input = event.target.value;
        setDescription(input);
    }

    async function sendGitHub() {

        // setOpen(false);

        const octokit = new Octokit({
            auth: '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'
        })

        await octokit.request('POST /repos/Kmbear3/BugTracking/issues', {
            owner: 'Kmbear3',
            repo: 'bugTracking',
            title: 'Found a Bug in Athena',
            body: description,
            labels: [
                'bug', 'userSubmitted'
            ]
        })

    }

    return (
        <div>
            <Button onClick={handleOpen}><BugReportIcon/>&nbsp;Report Bug</Button>
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
                        <Button onClick={() => {
                            sendGitHub().then(r => handleClose());
                        }}><SendIcon/>&nbsp;Submit Bug</Button>
                        <Button onClick={handleClose}><CloseIcon/></Button>
                    </Stack>
                </Paper>
            </Modal>
        </div>
    )

}
