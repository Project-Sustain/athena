import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import {makeStyles} from "@material-ui/core";
import {Button} from "@mui/material";
import {Octokit} from "@octokit/core";


const useStyles = makeStyles( {
    list: {
        maxHeight: "90vh",
        overflow: "auto",
        width: "100%"
    }
});

export function BugForm(props) {
    const classes = useStyles;

    async function sendGitHub() {
        const octokit = new Octokit({
            auth: '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'
        })

        await octokit.request('POST /repos/Kmbear3/BugTracking/issues', {
            owner: 'Kmbear3',
            repo: 'bugTracking',
            title: 'Found a Bug in Athena, test2',
            body: 'I\'m having a problem with this.',
            labels: [
                'bug', 'userSubmitted'
            ]
        })
    }

    return (
        <>
            <Button onClick={sendGitHub}>Submit Bug</Button>
        </>
    )

}
