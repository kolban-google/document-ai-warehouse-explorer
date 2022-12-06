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
import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import PropTypes from 'prop-types'
import JSONDialog from '../JSONDialog'
import DocumentDetails from './DocumentDetails.js'

/**
 * Display a dialog that shows the current schema details or create new schema details.
 * The dialog has a show, apply and cancel set of actions.
 * When either Apply or Cancel are clicked, the props.onClose function is invoked.  For Apply
 * the new Schema Details are passed and for Cancel, null is passed.
 * 
 * The document schema to show is passed in documentSchema.
 * 
 * To indicate that this is a new schema, the props.create flag is set to true.
 * @param {*} props  
 * @returns 
 */
function DocumentDetailsDialog(props) {

  const [document, setDocument] = React.useState(null)
  const [jsonDialogOpen, setJsonDialogOpen] = React.useState(false)

  if (props.open === true && document === null) {
    setDocument(props.document)
    return
  }

  if (props.open === false) {
    if (document !== null) {
      setDocument(null)
    }
    return
  }
  
  function onDocumentChange(document) {
    setDocument(document)
  } // onDocumentSchemaChange

  return (
    <Dialog open={props.open} fullWidth maxWidth="md">
      <DialogTitle>{props.create === true?"Create Document": "Document Details"}</DialogTitle>
      <DialogContent>
        <DocumentDetails document={document} onChange={onDocumentChange} create={props.create} schemaMap={props.schemaMap}/>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => { setJsonDialogOpen(true) }}>Show</Button>
        <Button variant="contained" color="primary" onClick={() => {props.close(document) }}>{props.create === true?"Create":"Apply"}</Button>
        <Button variant="contained" color="primary" onClick={() => {props.close(null) }}>Cancel</Button>
      </DialogActions>
      <JSONDialog title="Document Details" jsonData={document} open={jsonDialogOpen} close={() => { setJsonDialogOpen(false) }} />
    </Dialog>
  );
} // DocumentDetailsDialog

DocumentDetailsDialog.propTypes = {
  "open": PropTypes.bool.isRequired,
  "close": PropTypes.func.isRequired,
  "document": PropTypes.object.isRequired,
  "create": PropTypes.bool,
  "schemaMap": PropTypes.object.isRequired
}

export default DocumentDetailsDialog;