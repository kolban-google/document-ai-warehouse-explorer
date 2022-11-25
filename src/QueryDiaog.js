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
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view'
import Query from './Query';

/**
 * Display the settings
 * 
 */
function QueryDialog(props) {

  const [documentQuery, setDocumentQuery] = React.useState(props.documentQuery)

  React.useEffect(() => {
    setDocumentQuery(props.documentQuery)
  }, [props.open])

  /**
   * render
   * @returns 
   */

  function documentQueryOnChange(documentQuery) {
    setDocumentQuery(documentQuery)
  } // documentQueryOnChange

  return (
    <Dialog open={props.open} fullWidth maxWidth="md">
      <DialogTitle>Query Settings</DialogTitle>
      <DialogContent>
        <Query schemaMap={props.schemaMap} documentQuery={documentQuery} onChange={documentQueryOnChange}/>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => {props.close(documentQuery)}}>
          Apply
        </Button>
        <Button variant="contained" color="primary" onClick={() => {props.close(null)}}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

QueryDialog.propTypes = {
  'open': PropTypes.bool.isRequired,
  'documentQuery': PropTypes.object.isRequired,
  'close': PropTypes.func.isRequired,
}

export default QueryDialog;