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
import DAW from '../daw.js'
import { Box, IconButton } from '@mui/material'
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import JSONDialog from '../JSONDialog.js';
import RuleSetDetailsDialog from './RuleSetDetailsDialog.js';


/**
 * props.schemaMap = Map of schemas
 * props.onSelectionChanged = a function that takes an array of the currently selected items
 * @param {*} props 
 * @returns 
 */
function RulesGrid(props) {

  const [jsonDialogOpen, setJsonDialogOpen] = React.useState(false)
  const [ruleInfo, setRuleInfo] = React.useState({})
  const [ruleSetDetailsDialogOpen, setRuleSetDetailsDialogOpen] = React.useState(false)

  async function onInfoClick(param) {
    // param.row.document.name = Identity of the Document
    const result = await DAW.getRuleSet(param.row.name)
    setRuleInfo(result)
    setJsonDialogOpen(true)
  } // onInfoClick

  async function onEditClick(param) {
    const result = await DAW.getRuleSet(param.row.name)
    setRuleInfo(result)
    setRuleSetDetailsDialogOpen(true)
  } // onEditClick

  const columns = [
    {
      field: "info", headerName: "", width: 50, renderCell: (param) => {
        return (
          <IconButton onClick={() => { onInfoClick(param) }}>
            <InfoIcon />
          </IconButton>
        )
      }
    },
    {
      "field": "edit", "headerName": "", "width": 50, "renderCell": (param) => {
        return (
          <IconButton onClick={() => { onEditClick(param) }}>
            <EditIcon />
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
  } // onSelectionModelChange

  function getRowId(row) {
    return row.name;
  } // getRowId

  let rows = [];
  if (props.rules) {
    rows = props.rules;
  }
  //debugger;
  return (
    <Box sx={{ flexGrow: 1, height: "100%" }}>
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
      <JSONDialog title="RuleSet JSON" jsonData={ruleInfo} open={jsonDialogOpen} close={() => { setJsonDialogOpen(false) }} />
      <RuleSetDetailsDialog ruleSet={ruleInfo} open={ruleSetDetailsDialogOpen} close={(newRuleSet) => {
        setRuleSetDetailsDialogOpen(false)
        if (newRuleSet) {
          DAW.patchRuleSet(newRuleSet)
        }
      }} />
    </Box>
  )
}

RulesGrid.propTypes = {
  rules: PropTypes.array,
}

export default RulesGrid