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
import { Box, Select, MenuItem, Grid, TextField, InputLabel, List, ListItem, Table, TableRow, TableHead, TableCell, TableBody, TableContainer } from '@mui/material'
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view'

function Rule(props) {
  let x= {};
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="description" variant="standard" />
        </Grid>
        {/*}
        <Grid item xs={12}>
          <TextField label="ruleId" variant="standard" />
        </Grid>
  */}
        <Grid item xs={12}>
          <TextField label="condition" variant="standard" />
        </Grid>
        <Grid item xs={12}>
        <InputLabel id="triggerType">Trigger Type</InputLabel>
          <Select id="triggerType">
            <MenuItem value={10}>Access Control</MenuItem>
            <MenuItem value={20}>Data Validation</MenuItem>
            <MenuItem value={30}>Data Update</MenuItem>
            <MenuItem value={40}>Add To Folder</MenuItem>
            <MenuItem value={50}>Publish To PubSub</MenuItem>
            <MenuItem value={60}>Remove From Folder</MenuItem>
            <MenuItem value={70}>Delete Document</MenuItem>
          </Select>
        </Grid>
        <ReactJson src={x} onAdd={()=>{}} onEdit={() => {}} onDelete={() => {}}/>
      </Grid>
    </Box>
  )
} // 

Rule.propTypes = {
}

export default Rule