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
import { Box, Button } from '@mui/material'
import PropTypes from 'prop-types';
import DocumentsGrid from './DocumentsGrid.js';
import Query from './Query.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import QueryDialog from './QueryDiaog.js';

function DocumentsView(props) {
  const [searchResults, setSearchResults] = React.useState(null);
  const [selection, setSelection] = React.useState([]);
  const [schemaMap, setSchemaMap] = React.useState(new Map());
  const [documentQuery, setDocumentQuery] = React.useState({"query": ""})
  const [queryDialogOpen, setQueryDialogOpen] = React.useState(false)

  const initied = React.useRef(false);


  // We want a first time initialization
  if (initied.current === false) {
    DAW.listSchemas({makeMap: true}).then((result) => {
      initied.current = true
      setSchemaMap(result)
    })
  }

  async function onRefresh() {
    const results = await DAW.queryDocuments(documentQuery);
    setSearchResults(results);
  } // onRefresh

  function onSelectionChanged(selection) {
    setSelection(selection)
  } // onSelectionChanged

  async function onDelete() {
    for (let i=0; i<selection.length; i++) {
      await DAW.deleteDocument(selection[i])
    }
    onRefresh()
  } // onDelete

  /**
   * Called when the documentQuery object changes.
   * @param {*} documentQuery 
   */
  function documentQueryOnChange(documentQuery) {
    //debugger;
    setDocumentQuery(documentQuery)
  } // documentQueryOnChange

  return (
    <Box>
      <p>Documents View</p>
      <Button onClick={onRefresh} variant="contained" endIcon={<RefreshIcon/>}>Refresh</Button>
      <Button onClick={() => {setQueryDialogOpen(true)}} variant="contained" endIcon={<RefreshIcon/>}>Query</Button>
      {/*<Query schemaMap={schemaMap} documentQuery={documentQuery} onChange={documentQueryOnChange}/>*/}
      <DocumentsGrid schemaMap={schemaMap} searchResults={searchResults} onSelectionChanged={onSelectionChanged}/>
      <Button onClick={onDelete} variant="contained" endIcon={<DeleteForeverIcon/>}>Delete</Button>
      <QueryDialog schemaMap={schemaMap} documentQuery={documentQuery} open={queryDialogOpen} close={(documentQuery) => {
          setQueryDialogOpen(false)
        if (documentQuery !== null) {
          setDocumentQuery(documentQuery)
        }
      }}/>
    </Box>
  )
} // DocumentsView

DocumentsView.propTypes = {
}

export default DocumentsView