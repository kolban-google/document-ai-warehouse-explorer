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
function DocumentsGrid(props) {

  const [jsonDialogOpen, setJsonDialogOpen] = React.useState(false)
  const [documentInfo, setDocumentInfo] = React.useState({})   

  async function onInfoClick(param) {
    // param.row.document.name = Identity of the Document
    const result = await DAW.getDocument(param.row.document.name)
    if (result.cloudAiDocument && result.cloudAiDocument.content) {
      result.cloudAiDocument.content = "<Snip>"
    }
    setDocumentInfo(result)
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
      field: 'document.name', headerName: 'name', width: 200, valueGetter: (param) => {
        //debugger;
        return DAW.getDocumentId(param.row.document.name)
      }
    },
    {
      field: 'searchTextSnippet', headerName: 'snippet', width: 200, valueGetter: (param) => {
        return param.row.searchTextSnippet
      }
    },
    {
      field: 'document.displayName', headerName: 'display', width: 200, valueGetter: (param) => {
        return param.row.document.displayName
      }
    },
    {
      field: 'document.documentSchemaName', headerName: 'documentSchemaName', width: 200, valueGetter: (param) => {
        const value = props.schemaMap.get(param.row.document.documentSchemaName);
        if (value === undefined) {
          return DAW.getSchemaId(param.row.document.documentSchemaName)
        }
        return `${value.displayName} (${DAW.getSchemaId(param.row.document.documentSchemaName)})`
      }
    },
    {
      field: 'document.createTime', headerName: 'createTime', width: 250, valueGetter: (param) => {
        return param.row.document.createTime
      }
    },
    {
      field: 'document.updateTime', headerName: 'updateTime', width: 250, valueGetter: (param) => {
        return param.row.document.updateTime
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
    return row.document.name;
  }
  //debugger;
  return (
    <Box>

      <p>Documents Grid</p>
      <Box height="400px">
        <DataGrid
          rows={props.searchResults && props.searchResults.matchingDocuments?props.searchResults.matchingDocuments:[]}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={getRowId}
          onSelectionModelChange={onSelectionModelChange}
        />
      </Box>
      <JSONDialog title="Document JSON" jsonData={documentInfo} open={jsonDialogOpen} close={() => {setJsonDialogOpen(false)}} data={{}}/>
    </Box>
  )
}

DocumentsGrid.propTypes = {
  onSelectionChanged: PropTypes.func,
  schemaMap: PropTypes.object
}

export default DocumentsGrid