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
import { Box, Button } from '@mui/material'
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import SchemasGrid from './SchemasGrid.js';

function SchemasView(props) {
  const [searchResults, setSearchResults] = React.useState(null);
  const [selection, setSelection] = React.useState([]);
  const [schemas, setSchemas] = React.useState(new Map());



  async function onRefresh() {
    const results = await DAW.listSchemas();
    setSearchResults(results);
  } // onRefresh

  function onSelectionChanged(selection) {
    setSelection(selection)
  } // onSelectionChanged

  async function onDelete() {
    for (let i=0; i<selection.length; i++) {
      await DAW.deleteSchema(selection[i])
    }
    onRefresh()
  } // onDelete

  return (
    <Box>
      <p>Schemas View</p>
      <Button onClick={onRefresh} variant="contained" endIcon={<RefreshIcon/>}>Refresh</Button>
      <SchemasGrid schemaMap={schemas} searchResults={searchResults} onSelectionChanged={onSelectionChanged}/>
      <Button onClick={onDelete} variant="contained" endIcon={<DeleteForeverIcon/>}>Delete</Button>
    </Box>
  )
} // DocumentsView

SchemasView.propTypes = {
}

export default SchemasView