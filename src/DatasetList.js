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
//import { useState } from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar, Button, List, ListItem, ListItemButton } from '@mui/material'
import BQ from './bq.js'
import PropTypes from 'prop-types';
/**
 * 
 * @param {*} props 
 * @returns 
 * 
 * props.datasets - An array of datasets
 */
function DatasetList(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  async function handleSelect(event, index) {
    setSelectedIndex(index)
    const selectedDataset = props.datasets[index];
    //const tables = await BQ.listTables(selectedDataset.datasetReference.projectId, selectedDataset.datasetReference.datasetId)
    if (props.onSelect) {
      props.onSelect(selectedDataset.datasetReference.datasetId)
    }
    debugger;
  }

  function getSelected(index) {
    return props.datasets[selectedIndex];
  }
  if (props.datasets === undefined) {
    return (<Box>No Datasets</Box>)
  }

  return (

    <List dense>
      {
        props.datasets.map((dataset, index) => {
          return <ListItemButton
            selected={selectedIndex === index}
            onClick={(event) => handleSelect(event, index)}
            key={dataset.datasetReference.datasetId}>{dataset.datasetReference.datasetId}</ListItemButton>
        })
      }
    </List>
  )
} // EntityInfoDialog

DatasetList.propTypes = {
  'datasets': PropTypes.array.isRequired,
}

export default DatasetList