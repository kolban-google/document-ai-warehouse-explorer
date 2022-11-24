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
import DAW from './daw.js'
import { Box, IconButton } from '@mui/material'
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import JSONDialog from './JSONDialog.js';


/**
 * props.schemaMap = Map of schemas
 * props.onSelectionChanged = a function that takes an array of the currently selected items
 * @param {*} props 
 * @returns 
 */
function SchemasGrid(props) {

  const [jsonDialogOpen, setJsonDialogOpen] = useState(false)
  const [schemaInfo, setSchemaInfo] = useState({})  

  async function onInfoClick(param) {
    const result = await DAW.getSchema(param.row.name)
    setSchemaInfo(result)
    setJsonDialogOpen(true)
  } // onInfoClick

  const columns = [
    {
      "field": "info", "headerName": "", "width": 50, "renderCell": (param) => {
        return (
          <IconButton onClick={() => {onInfoClick(param)}}>
            <InfoIcon />
          </IconButton>
        )
      }
    },
    {
      "field": 'schema.name', "headerName": 'name', "width": 200, "valueGetter": (param) => {
        return `${param.row.displayName} (${DAW.getSchemaId(param.row.name)})`
      }
    }
  ];

  function onSelectionModelChange(selectionArray) {
    if (props.onSelectionChanged) {
      props.onSelectionChanged(selectionArray)
    }
  } // onSelectionModelChange

  function getRowId(row) {
    return row.name;
  } // getRowId

  let rows = [];
  if (props.searchResults) {
    rows = props.searchResults.documentSchemas;
  }

  return (
    <Box>
      <p>Schemas Grid</p>
      <Box height="400px">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={getRowId}
          onSelectionModelChange={onSelectionModelChange}
        />
      </Box>
      <JSONDialog title="Schema JSON" jsonData={schemaInfo} open={jsonDialogOpen} close={() => {setJsonDialogOpen(false)}} data={{}}/>
    </Box>
  )
} // SchemasGrid

SchemasGrid.propTypes = {
  "onSelectionChanged": PropTypes.func,
  "schemas": PropTypes.object
}

export default SchemasGrid