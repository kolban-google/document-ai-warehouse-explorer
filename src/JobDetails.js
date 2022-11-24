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
import { Box, AppBar, IconButton, Typography, Toolbar, Button, List, ListItem, Table, TableRow, TableHead, TableCell, TableBody, TextField, Grid, Item } from '@mui/material'
import BQ from './bq.js'
import PropTypes from 'prop-types';
import Utils from './utils.js';

/**
 * 
 * @param {*} props 
 * @returns 
 * 
 * props.job - The details of the Job object (see: https://cloud.google.com/bigquery/docs/reference/rest/v2/Job)
 */
function JobDetails(props) {


  function field(label, value) {
    if (value === null || value === undefined) {
      value = "N/A"
    }
    return (
      <TextField
        size="small"
        fullWidth
        label={label}
        value={value}
        InputProps={{
          readOnly: true,
        }} />
    )
  }

  function safeToString(item) {
    if (item === null || item === undefined) {
      return ""
    }
    return item.toString();
  }


  if (props.job === undefined || props.job === null) {
    return (<Box>No Job</Box>)
  }

  const job = props.job

  return (
    <Box sx={{ margin: "4px" }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          {field('Job Id', job.jobReference.jobId)}
        </Grid>
        <Grid item xs={4}>
          {field('project Id', job.jobReference.projectId)}
        </Grid>
        <Grid item xs={4}>
          {field('Location', job.jobReference.location)}
        </Grid>
        <Grid item xs={4}>
          {field('Created', new Date(Number(job.statistics.creationTime)).toISOString())}
        </Grid>
        <Grid item xs={4}>
          {field('Started', new Date(Number(job.statistics.startTime)).toISOString())}
        </Grid>
        <Grid item xs={4}>
          {field('Ended', new Date(Number(job.statistics.endTime)).toISOString())}
        </Grid>
        <Grid item xs={4}>
          {field('Elapsed', `${Number(job.statistics.endTime) - Number(job.statistics.startTime)}ms`)}
        </Grid>

        <Grid item xs={4}>
          {field('Total Bytes Processed', job.statistics.totalBytesProcessed ? Utils.byteLengthToString(Number(job.statistics.totalBytesProcessed)) : "N/A")}
        </Grid>
        <Grid item xs={4}>
          {field('User', job.user_email)}
        </Grid>
        {/* The statistics.reservation_id is the identity of a slot reservation IF this job ran in flate rate (slots).  It is not present if it ran on-demand */}
        <Grid item xs={4}>
          {field('Reservation Id', job.statistics.reservation_id)}
        </Grid>

        {
          job.statistics.query !== undefined ? <Grid container item xs={12} spacing={2} >
            <Grid item xs={4}>
              {field('Cache Hit', safeToString(job.statistics.query.cacheHit))}
            </Grid>
            <Grid item xs={4}>
              {field('Total Slot MS', job.statistics.query.totalSlotMs ? job.statistics.query.totalSlotMs : "N/A")}
            </Grid>
            <Grid item xs={4}>
              {field('Total Bytes Billed', Utils.byteLengthToString(Number(job.statistics.query.totalBytesBilled)))}
            </Grid>


            {job.statistics.query.referencedTables !== undefined && job.statistics.query.referencedTables.map((referencedTable) => {
              return (
                <Grid item xs={12}>
                  <p>Referenced Tables</p>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={4}>
                      {field('projectId', referencedTable.projectId)}
                    </Grid>
                    <Grid item xs={4}>
                      {field('datasetId', referencedTable.datasetId)}
                    </Grid>

                    <Grid item xs={4}>
                      {field('tableId', referencedTable.tableId)}
                    </Grid>
                  </Grid>
                </Grid>
              )
            })}
            {job.statistics.query.searchStatistics !== undefined ?

              <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                  {field('Index Usage Mode', job.statistics.query.searchStatistics.indexUsageMode)}
                </Grid>
                {job.statistics.query.searchStatistics.indexUnusedReasons !== undefined && job.statistics.query.searchStatistics.indexUnusedReasons.map((unusedReason) => {
                  return (
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={4}>
                        {field('code', unusedReason.code)}
                      </Grid>
                      <Grid item xs={4}>
                        {field('message', unusedReason.message)}
                      </Grid>
                      <Grid item xs={4}>
                        {field('index Name', unusedReason.indexName)}
                      </Grid>
                    </Grid>
                  )
                })}

              </Grid> : null
            }
          </Grid> : null
        }
        {/* Show the query that was executed */}
        <Grid item xs={12}>
          <TextField
            multiline
            size="small"
            fullWidth
            label="Query"
            value={job.configuration.query.query}
            InputProps={{
              readOnly: true,
            }} />
        </Grid>
      </Grid>
    </Box>
  )
}

JobDetails.propTypes = {
  'job': PropTypes.object.isRequired
}

export default JobDetails