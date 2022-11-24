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
function RulesGrid(props) {

  const [jsonDialogOpen, setJsonDialogOpen] = useState(false)
  const [ruleInfo, setRuleInfo] = useState({})  

  async function onInfoClick(param) {
    // param.row.document.name = Identity of the Document
    const result = await DAW.getRuleSet(param.row.name)
    setRuleInfo(result)
    setJsonDialogOpen(true)
  }

  const columns = [
    {
      field: "info", headerName: "", width: 50, renderCell: (param) => {
        return (
          <IconButton onClick={() => {onInfoClick(param)}}>
            <InfoIcon />
          </IconButton>
        )
      }
    },
    {
      field: 'name', headerName: 'name', width: 200, valueGetter: (param) => {
          return DAW.getRuleSetId(param.row.name)
      }
    },
    {
      field: 'description', headerName: 'description', width: 500, valueGetter: (param) => {
          return param.row.description
      }
    }
  ];

  function onSelectionModelChange(selectionArray) {
    if (props.onSelectionChanged) {
      props.onSelectionChanged(selectionArray)
    }
  }

  function getRowId(row) {
    //debugger;
    return row.name;
  }
  let rows = [];
  if (props.rules) {
    rows = props.rules;
  }
  //debugger;
  return (
    <Box>

      <p>Rules Grid</p>
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
      <JSONDialog title="RuleSet JSON" jsonData={ruleInfo} open={jsonDialogOpen} close={() => {setJsonDialogOpen(false)}} data={{}}/>
    </Box>
  )
}

RulesGrid.propTypes = {
  rules: PropTypes.array,
}

export default RulesGrid