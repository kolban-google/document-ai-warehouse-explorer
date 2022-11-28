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

/**
 * Display the details of a schema allowing the user to change the schema.
 * Changes to the schema are passed in the props.onChange().  The schema
 * is passed in through props.documentSchema.
 * 
 * @param {*} props 
 * @returns 
 */
function SchemaDetails(props) {

  function onChange(newPropertyDefinition) {
    props.onChange(newPropertyDefinition)
  }

  function onPropertyDefinitionChange(newPropertyDefinition, index) {
    const newDocumentSchema = _.cloneDeep(props.documentSchema)
    newDocumentSchema.propertyDefinitions[index] = newPropertyDefinition
    onChange(newDocumentSchema)
  } // onPropertyDefinitionChange


  function onDescriptionChange(evt) {
    const newDocumentSchema = _.cloneDeep(props.documentSchema)
    newDocumentSchema.description = evt.target.value
    onChange(newDocumentSchema)
  } // onDescriptionChange

  function onDisplayNameChange(evt) {
    const newDocumentSchema = _.cloneDeep(props.documentSchema)
    newDocumentSchema.displayName = evt.target.value
    onChange(newDocumentSchema)
  } // onDisplayNameChange

  function onDocumentIsFolderChange(evt) {
    const newDocumentSchema = _.cloneDeep(props.documentSchema)
    newDocumentSchema.documentIsFolder = evt.target.checked
    onChange(newDocumentSchema)
  } // onDocumentIsFolderChange

  function onAddNewPropertyDefinition() {
    const newDocumentSchema = _.cloneDeep(props.documentSchema)
    // Handle the case where the documentSchema doesn't have any propertyDefinitions.
    if (!newDocumentSchema.hasOwnProperty("propertyDefinitions")) {
      newDocumentSchema.propertyDefinitions = []
    }
    newDocumentSchema.propertyDefinitions.push({ "name": "", displayName: "", isRepeatable: false, isFilterable: false, isSearchable: false, isMetadata: false, isRequired: false, textTypeOptions: {} })
    onChange(newDocumentSchema)
  } // onAddNewPropertyDefinition

  function onDeletePropertyDefinition(index) {
    const newDocumentSchema = _.cloneDeep(props.documentSchema)
    newDocumentSchema.propertyDefinitions.splice(index, 1);
    onChange(newDocumentSchema)
  }

  /**
   * Display a list of propertyDefinitions.
   */
  let propertyDefinitionsComponents = [];
  if (props.documentSchema.propertyDefinitions) {
    props.documentSchema.propertyDefinitions.forEach((currentPropertyDefinition, index) => {
      propertyDefinitionsComponents.push(
        <Card key={index}>
          <CardContent>
            <Box sx={{width: "100%"}} flexGrow={1} display="flex" gap="10px" flexDirection="row">
              <PropertyDefinition create={props.create} propertyDefinition={currentPropertyDefinition} onChange={(propertyDefinition) => {
                onPropertyDefinitionChange(propertyDefinition, index)
              }} />
              <IconButton onClick={() => { onDeletePropertyDefinition(index) }} disabled={!props.create}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )
    })
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
      {!props.create ?
        <TextField value={props.documentSchema.name} label="Name" variant="outlined" disabled margin="dense"/>
        : null}
      <TextField value={props.documentSchema.displayName} onChange={onDisplayNameChange} label="Display Name" margin="dense" variant="outlined" error={props.documentSchema.displayName.length === 0}/>
      {!props.create ?
        <TextField value={props.documentSchema.updateTime} label="Update Time" variant="outlined" disabled />
        : null}
      {!props.create ?
        <TextField value={props.documentSchema.createTime} label="Create Time" variant="outlined" disabled />
        : null}
      <TextField value={props.documentSchema.description?props.documentSchema.description:""} onChange={onDescriptionChange} label="Description" variant="outlined" />
      <FormGroup>
        <FormControlLabel control={<Checkbox checked={props.documentSchema.documentIsFolder === true} onChange={onDocumentIsFolderChange} disabled={!props.create}/>} label="Folder" />
      </FormGroup>
      <Box>
      <Button variant="contained" onClick={onAddNewPropertyDefinition}>Add Property</Button>
      </Box>
      {propertyDefinitionsComponents}
    </Box>
  )
} // SchemaDetails

SchemaDetails.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "documentSchema": PropTypes.object.isRequired,
  "create": PropTypes.bool
}

export default SchemaDetails