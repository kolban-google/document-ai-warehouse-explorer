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
import { TextField, FormGroup, Box, FormControlLabel, Checkbox, Card, CardContent } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';
import DAW from '../daw'
import SchemaSelection from '../schemas/SchemaSelection';

/**
 * Display the details of a document
 * 
 * @param {*} props 
 * @returns 
 */
function DocumentDetails(props) {
  const [schema, setSchema] = React.useState(null)
  React.useEffect(() => {
    async function run() {
      console.log(`Looking up schema for "${props.document.documentSchemaName}"`)
      if (props.document.documentSchemaName.length === 0) {
        setSchema(null)
        return
      }
      const schema = await DAW.getSchema(props.document.documentSchemaName)
      setSchema(schema)
    }
    run()
  }, [props.document.documentSchemaName])

  /**
   * The document as a whole has changed
   * @param {*} document 
   */
  function onChange(document) {
    props.onChange(document)
  } // onChange

  function onSchemaNameChange(value) {
    const newDocument = _.cloneDeep(props.document)
    newDocument.documentSchemaName = value
    // If the schema has changed, that means that any existing properties are no longer valid
    newDocument.properties = []
    onChange(newDocument)
  } // onSchemaNameChange

  function onTextExtractionDisabledChange(evt) {
    const newDocument = _.cloneDeep(props.document)
    newDocument.textExtractionDisabled = evt.target.checked
    onChange(newDocument)
  }

  /**
   * When a text field changes, it sends an event that indicates the new value.
   * This generic function receives the event and a named field within the document.
   * That field is then set to the current value of the text field.
   * @param {*} fieldName 
   * @param {*} evt 
   */
  function onTextFieldChange(fieldName, evt) {
    const newDocument = _.cloneDeep(props.document)
    newDocument[fieldName] = evt.target.value
    onChange(newDocument)
  } // onTextFieldChange

  function onPropertyChange(evt, propertyDefinition) {
    const newDocument = _.cloneDeep(props.document)
    DAW.setPropertyValue(propertyDefinition, newDocument, evt.target.value)
    onChange(newDocument)
  }

  let propertyDefinitionsComponents = []
  if (schema !== null && schema.hasOwnProperty("propertyDefinitions")) {
    schema.propertyDefinitions.forEach((currentPropertyDefinition) => {
      const value = DAW.getPropertyValue(currentPropertyDefinition.name, props.document)
      propertyDefinitionsComponents.push(
        <Card key={currentPropertyDefinition.name}>
          <CardContent>
            <TextField fullWidth value={value !== undefined ? value : ""} label={currentPropertyDefinition.displayName} onChange={(evt) => { onPropertyChange(evt, currentPropertyDefinition) }} />
          </CardContent>
        </Card>
      )
    })
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
      <TextField value={props.document.displayName} label="Display Name" variant="outlined" error={props.document.displayName.length === 0} onChange={onTextFieldChange.bind(this, "displayName")} margin="dense" />
      <SchemaSelection schemaMap={props.schemaMap} disabled={props.create !== true} value={props.document.documentSchemaName} onChange={onSchemaNameChange} />
      {!props.create ?
        <TextField value={props.document.name} label="Name" variant="outlined" disabled margin="dense" />
        : null}
      <TextField value={props.document.referenceId ? props.document.referenceId : ""} label="Reference ID" onChange={onTextFieldChange.bind(this, "referenceId")} variant="outlined" />

      <TextField value={props.document.title ? props.document.title : ""} label="Title" variant="outlined" onChange={onTextFieldChange.bind(this, "title")} />
      <TextField value={props.document.displayUri ? props.document.displayUri : ""} label="Display URI" variant="outlined" onChange={onTextFieldChange.bind(this, "displayUri")} />

      <TextField value={props.document.structuredContentUri ? props.document.structuredContentUri : ""} label="Structured Content URI" variant="outlined" onChange={onTextFieldChange.bind(this, "structuredContentUri")} />
      {!props.create ?
        <TextField value={props.document.updateTime} disabled label="Update Time" variant="outlined" />
        : null}
      {!props.create ?
        <TextField value={props.document.createTime} disabled label="Create Time" variant="outlined" />
        : null}
      <TextField value={props.document.rawDocumentFileType} label="Raw Document File Type" variant="outlined" />
      {!props.create ?
        <TextField value={props.document.creator} disabled label="Creator" variant="outlined" />
        : null}
      {!props.create ?
        <TextField value={props.document.updater} disabled label="Updater" variant="outlined" />
        : null}
      <FormGroup>
        <FormControlLabel control={<Checkbox disabled={props.create !== true} checked={props.document.textExtractionDisabled === true} />} label="Text Extraction Disabled" onChange={onTextExtractionDisabledChange} />
      </FormGroup>
      {propertyDefinitionsComponents}
      <TextField value={props.document.plainText?props.document.plainText:""} label="Plain Text" multiline onChange={onTextFieldChange.bind(this, "plainText")}/>
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