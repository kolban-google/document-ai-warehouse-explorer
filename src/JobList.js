/*
# Copyright 2022, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
import React from 'react';
import { useState, useEffect } from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar, Button, List, ListItem, Table, TableRow, TableHead, TableCell, TableBody, TableContainer } from '@mui/material'
import BQ from './bq.js'
import PropTypes from 'prop-types';

function JobList(props) {

  /*
  useEffect(() => {
    async function run() {
      if (jobs === null) {
        const jobs = await BQ.jobsList();
        setJobs(jobs)
      }
    }
    run()
  })
  */
  //const [jobs, setJobs] = useState(null)
  const [selected, setSelected] = useState(null)

  function handleClick(event, job) {
    //debugger;
    setSelected(job)
    if (props.onSelected !== undefined) {
      props.onSelected(job)
    }
  }
  if (props.jobs === undefined) {
    return (<Box>No Jobs</Box>)
  }
  if (props.type === undefined || props.type === "LIST") {
    return (

      <List>
        {
          props.jobs !== null && props.jobs.map((job) => {
            return <ListItem key={job.jobReference.jobId}>{job.jobReference.jobId}</ListItem>
          })
        }
      </List>
    )
  }
  if (props.type === "TABLE") {
    return (
      <Box style={{ height: "100%" }}>
        <TableContainer sx={{height: "100%"}}>
          <Table stickyHeader sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Job Id</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Ended</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.jobs.map((job) => (
                <TableRow key={job.jobReference.jobId}
                  selected={selected != null && selected.jobReference.jobId === job.jobReference.jobId}
                  onClick={(event) => handleClick(event, job)}>
                  <TableCell component="th" scope="row">
                    {job.jobReference.jobId}
                  </TableCell>
                  <TableCell>{job.state}</TableCell>
                  <TableCell>{job.statistics.creationTime?new Date(Number(job.statistics.creationTime)).toISOString():"N/A"}</TableCell>
                  <TableCell>{job.statistics.endTime?new Date(Number(job.statistics.endTime)).toISOString():"N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
      </Box>
    )
  }
} // EntityInfoDialog

JobList.propTypes = {
  'jobs': PropTypes.array.isRequired,
  'onSelected': PropTypes.func
}

export default JobList