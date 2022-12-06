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
import { Box, Button } from '@mui/material'
//import PropTypes from 'prop-types';
import SchemasGrid from './SchemasGrid.js';
import SchemaDetailsDialog from './SchemaDetailsDialog.js';
import ErrorDialog from '../ErrorDialog.js';
//
// Icons
//
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RefreshIcon from '@mui/icons-material/Refresh';


/**
 * A view that shows the schemas associated with Document AI Warehouse.
 * @param {*} props 
 * @returns 
 */
function SchemasView(props) {
  const [searchResults, setSearchResults] = React.useState(null);
  const [selection, setSelection] = React.useState([]);
  const [schemaDetailsDialogOpen, setSchemaDetailsDialogOpen] = React.useState(false);
  const [error, setError] = React.useState({ "message": "No Error" })
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

  const templateDocumentSchema = { "name": "", displayName: "", documentIsFolder: false, updateTime: "", createTime: "", description: "", propertyDefinitions: [] }

  async function onRefresh() {
    try {
      const results = await DAW.listSchemas();
      setSearchResults(results);
    }
    catch (e) {
      showError(e.result.error)
    }
  } // onRefresh

  function showError(e) {
    setError(e)
    setErrorDialogOpen(true)
  } // showError

  function onSelectionChanged(selection) {
    setSelection(selection)
  } // onSelectionChanged

  function onCreate() {
    //setNewDocumentSchema({"name": "", displayName: "", documentIsFolder: false, updateTime: "", createTime: "", description: "", propertyDefinitions: []})
    setSchemaDetailsDialogOpen(true)
  }

  async function createSchema(newSchema) {
    try {
      await DAW.createSchema(newSchema)
      onRefresh()
    }
    catch (e) {
      showError(e.result.error)
    }
  } // createSchema

  async function onDelete() {
    try {
      for (let i = 0; i < selection.length; i++) {
        await DAW.deleteSchema(selection[i])
      }
      onRefresh()
    }
    catch (e) {
      showError(e.result.error)
    }
  } // onDelete

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", rowGap: 1 }}>
      <SchemasGrid searchResults={searchResults} onSelectionChanged={onSelectionChanged} />
      <Box sx={{ display: "flex", columnGap: 1 }}>
        <Button onClick={onDelete} variant="contained" disabled={selection.length === 0} endIcon={<DeleteForeverIcon />}>Delete</Button>
        <Button onClick={onCreate} variant="contained" endIcon={<AddCircleIcon />}>Create</Button>
        <Button onClick={onRefresh} variant="contained" endIcon={<RefreshIcon />}>Refresh</Button>
      </Box>
      <SchemaDetailsDialog documentSchema={templateDocumentSchema} open={schemaDetailsDialogOpen} close={(newSchema) => {
        setSchemaDetailsDialogOpen(false)
        if (newSchema) {
          createSchema(newSchema)
        }
      }} create={true} />
      <ErrorDialog open={errorDialogOpen} close={() => { setErrorDialogOpen(false) }} error={error} />
    </Box>
  )
} // DocumentsView

/*
SchemasView.propTypes = {
}
*/

export default SchemasView