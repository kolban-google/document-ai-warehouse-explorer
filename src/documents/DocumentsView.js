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
import DocumentsGrid from './DocumentsGrid.js';
import QueryDialog from './QueryDialog.js';
import DocumentDetailsDialog from './DocumentDetailsDialog.js';
import ErrorDialog from '../ErrorDialog'
// Icons
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';


const newDocumentTemplate = {
  "name": "",
  "referenceId": "",
  "displayName": "",
  "title": "",
  "displayUri": "",
  "documentSchemaName": "",
  "structuredContentUri": "",
  "updateTime": "",
  "createTime": "",
  "textExtractionDisabled": false,
  "rawDocumentFileType": "RAW_DOCUMENT_FILE_TYPE_UNSPECIFIED",
  "creator": "",
  "updater": ""
}

function DocumentsView(props) {
  const [searchResults, setSearchResults] = React.useState({})
  const [selection, setSelection] = React.useState([])
  const [schemaMap, setSchemaMap] = React.useState(new Map())
  const [documentQuery, setDocumentQuery] = React.useState({ "query": "" })
  const [queryDialogOpen, setQueryDialogOpen] = React.useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false)
  const [error, setError] = React.useState({ "message": "No Error" })
  const [documentDetailsDialogOpen, setDocumentDetailsDialogOpen] = React.useState(false)
  const [newDocument, setNewDocument] = React.useState(newDocumentTemplate)

  const initied = React.useRef(false)


  // We want a first time initialization
  if (initied.current === false) {
    DAW.listSchemas({ makeMap: true }).then((result) => {
      initied.current = true
      setSchemaMap(result)
    })
  }

  function showError(e) {
    setError(e)
    setErrorDialogOpen(true)
  } // error

  /**
   * Refresh the documents in the table.
   */
  async function onRefresh() {
    try {
      const results = await DAW.queryDocuments(documentQuery);
      setSearchResults(results);
    }
    catch (e) {
      showError(e.result.error)
    }
  } // onRefresh

  /**
   * Remember that the selection has changed.
   * @param {*} selection 
   */
  function onSelectionChanged(selection) {
    setSelection(selection)
  } // onSelectionChanged

  /**
   * Handle document deletions
   */
  async function onDelete() {
    try {
      for (let i = 0; i < selection.length; i++) {
        await DAW.deleteDocument(selection[i])
      }
      onRefresh()
    }
    catch (e) {
      showError(e.result.error)
    }
  } // onDelete

  /**
   * Create a new document that is described in the passed in parameter.
   * @param {*} newDocument 
   */
  function createDocument(newDocument) {
    try {
      // Delete any fields that shouldn't be present
      delete newDocument.updateTime
      delete newDocument.createTime
      DAW.createDocument(newDocument).then(onRefresh)
    }
    catch (e) {
      showError(e.result.error)
    }
  } // createDocument

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", rowGap: 1 }}>
      <DocumentsGrid schemaMap={schemaMap} searchResults={searchResults} onSelectionChanged={onSelectionChanged} onRefresh={onRefresh} />
      <Box sx={{ display: "flex", columnGap: 1 }}>
        <Button onClick={onDelete} variant="contained" disabled={selection.length === 0} endIcon={<DeleteForeverIcon />}>Delete</Button>
        <Button onClick={() => { setQueryDialogOpen(true) }} variant="contained" endIcon={<SettingsIcon />}>Query</Button>
        <Button onClick={() => { setDocumentDetailsDialogOpen(true) }} variant="contained" endIcon={<AddCircleIcon />}>Create</Button>
        <Button onClick={onRefresh} variant="contained" endIcon={<RefreshIcon />}>Refresh</Button>
      </Box>
      <QueryDialog schemaMap={schemaMap} documentQuery={documentQuery} open={queryDialogOpen} close={(documentQuery) => {
        setQueryDialogOpen(false)
        if (documentQuery !== null) {
          setDocumentQuery(documentQuery)
        }
      }} showQuery={true} />
      <DocumentDetailsDialog document={newDocument} create={true} schemaMap={schemaMap} open={documentDetailsDialogOpen}
        close={(newDocument) => {
          setDocumentDetailsDialogOpen(false)
          if (newDocument) {
            createDocument(newDocument)
          }
        }} />
      <ErrorDialog open={errorDialogOpen} close={() => { setErrorDialogOpen(false) }} error={error} />
    </Box>
  )
} // DocumentsView

/*
DocumentsView.propTypes = {
}
*/

export default DocumentsView