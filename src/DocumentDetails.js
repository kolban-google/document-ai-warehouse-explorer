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
import { TextField, FormGroup, Box, FormControlLabel, Checkbox, Card, CardContent, Button, IconButton } from '@mui/material'
import PropTypes from 'prop-types';
import PropertyDefinition from './PropertyDefinition.js';
import _ from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import SchemaSelection from './SchemaSelection.js';

/**
 * Display the details of a document
 * 
 * @param {*} props 
 * @returns 
 */
function DocumentDetails(props) { 

  function onChange(document) {
    props.onChange(document)
  }

  function onSchemaNameChange(value) {
    const newDocument = _.cloneDeep(props.document)
    newDocument.documentSchemaName = value
    onChange(newDocument)
  }

  function onDisplayNameChange(evt) {
    const newDocument = _.cloneDeep(props.document)
    newDocument.displayName = evt.target.value
    onChange(newDocument)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
      {!props.create?
      <TextField value={props.document.name} label="Name" variant="outlined" disabled margin="dense" />
      :null}
      <TextField value={props.document.referenceId} label="Reference ID" variant="outlined" />
      <TextField value={props.document.displayName} label="Display Name" variant="outlined" onChange={onDisplayNameChange} />
      <TextField value={props.document.title} label="Title" variant="outlined" />
      <TextField value={props.document.displayUri} label="Display URI" variant="outlined" />
      <SchemaSelection schemaMap={props.schemaMap} disabled={props.create !== true} value={props.document.documentSchemaName} onChange={onSchemaNameChange} />
      <TextField value={props.document.structuredContentUri} label="Structure Content URI" variant="outlined" />
      {!props.create?
      <TextField value={props.document.updateTime} disabled label="Update Time" variant="outlined" />
      :null}
      {!props.create?
      <TextField value={props.document.createTime} disabled label="Create Time" variant="outlined" />
      :null}
      <TextField value={props.document.rawDocumentFileType} label="Raw Document File Type" variant="outlined" />
      {!props.create?
      <TextField value={props.document.creator} disabled label="Creator" variant="outlined" />
      :null}
      {!props.create?
      <TextField value={props.document.updater} disabled label="Updater" variant="outlined" />
      :null}
      <FormGroup>
        <FormControlLabel control={<Checkbox disabled={props.create !== true} checked={props.document.textExtractionDisabled === true} />} label="Text Extraction Disabled" />
      </FormGroup>
    </Box>
  )
} // DocumentDetails

DocumentDetails.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "document": PropTypes.object.isRequired,
  "create": PropTypes.bool,
  "schemaMap": PropTypes.object.isRequired
}

export default DocumentDetails