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
import { TextField, FormGroup, FormControlLabel, Checkbox, Box, Grid, MenuItem } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * @param {*} props 
 * @returns 
 */
function PropertyDefinition(props) {

  let type = "";
  if (props.propertyDefinition.integerTypeOptions) {
    type = "integerTypeOptions"
  } else if (props.propertyDefinition.textTypeOptions) {
    type = "textTypeOptions"
  } else if (props.propertyDefinition.floatTypeOptions) {
    type = "floatTypeOptions"
  } else if (props.propertyDefinition.propertyTypeOptions) {
    type = "propertyTypeOptions"
  } else if (props.propertyDefinition.enumTypeOptions) {
    type = "enumTypeOptions"
  } else if (props.propertyDefinition.dateTimeTypeOptions) {
    type = "dateTimeTypeOptions"
  } else if (props.propertyDefinition.mapTypeOptions) {
    type = "mapTypeOptions"
  } else if (props.propertyDefinition.timestampTypeOptions) {
    type = "timestampTypeOptions"
  }

  function onChange(propertyDefinition) {
    props.onChange(propertyDefinition)
  } // onChange

  function onTypeChange(evt) {
    const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
    delete newPropertyDefinition.textTypeOptions
    delete newPropertyDefinition.integerTypeOptions
    delete newPropertyDefinition.floatTypeOptions
    delete newPropertyDefinition.propertyTypeOptions
    delete newPropertyDefinition.enumTypeOptions
    delete newPropertyDefinition.dateTimeTypeOptions
    delete newPropertyDefinition.mapTypeOptions
    delete newPropertyDefinition.timestampTypeOptions
    newPropertyDefinition[evt.target.value] = {}
    onChange(newPropertyDefinition)
  }

  function onDisplayNameChange(evt) {
    const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
    newPropertyDefinition.displayName = evt.target.value
    onChange(newPropertyDefinition)
  }

  function onNameChange(evt) {
    const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
    newPropertyDefinition.name = evt.target.value
    onChange(newPropertyDefinition)
  }

  return (
    <Box>
      <Grid container spacing={2}>

        <Grid item xs={6}>
          <TextField fullWidth value={props.propertyDefinition.name} label="Name" variant="outlined" onChange={onNameChange} />
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth value={props.propertyDefinition.displayName} onChange={onDisplayNameChange} label="Display Name" variant="outlined" error={props.propertyDefinition.displayName.length === 0} />
        </Grid>
      </Grid>
      <FormGroup row={true}>
        <FormControlLabel control={<Checkbox checked={props.propertyDefinition.isRepeatable} onChange={(evt) => {
          const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
          newPropertyDefinition.isRepeatable = evt.target.checked
          onChange(newPropertyDefinition)
        }} />} label="Repeatable" />
        <FormControlLabel control={<Checkbox checked={props.propertyDefinition.isFilterable} onChange={(evt) => {
          const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
          newPropertyDefinition.isFilterable = evt.target.checked
          onChange(newPropertyDefinition)
        }} />} label="Filterable" />
        <FormControlLabel control={<Checkbox checked={props.propertyDefinition.isSearchable} onChange={(evt) => {
          const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
          newPropertyDefinition.isSearchable = evt.target.checked
          onChange(newPropertyDefinition)
        }} />} label="Searchable" />
        <FormControlLabel control={<Checkbox checked={props.propertyDefinition.isMetadata} onChange={(evt) => {
          const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
          newPropertyDefinition.isMetadata = evt.target.checked
          onChange(newPropertyDefinition)
        }} />} label="Metadata" />
        <FormControlLabel control={<Checkbox checked={props.propertyDefinition.isRequired} onChange={(evt) => {
          const newPropertyDefinition = _.cloneDeep(props.propertyDefinition)
          newPropertyDefinition.isRequired = evt.target.checked
          onChange(newPropertyDefinition)
        }} />} label="Required" />
      </FormGroup>
      <TextField
        select
        variant="outlined"
        fullWidth
        label="Type"
        value={type}
        onChange={onTypeChange}
      >
        <MenuItem key="textTypeOptions" value="textTypeOptions">Text</MenuItem>
        <MenuItem key="integerTypeOptions" value="integerTypeOptions">Integer</MenuItem>
        <MenuItem key="floatTypeOptions" value="floatTypeOptions">Float</MenuItem>
        <MenuItem key="propertyTypeOptions" value="propertyTypeOptions">Properties</MenuItem>
        <MenuItem key="enumTypeOptions" value="enumTypeOptions">Enum</MenuItem>
        <MenuItem key="dateTimeTypeOptions" value="dateTimeTypeOptions">Date/Time</MenuItem>
        <MenuItem key="mapTypeOptions" value="mapTypeOptions">Map</MenuItem>
        <MenuItem key="timestampTypeOptions" value="timestampTypeOptions">Timestamp</MenuItem>
      </TextField>
    </Box>
  )
} // PropertyDefinition

PropertyDefinition.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "propertyDefinition": PropTypes.object.isRequired,
  "create": PropTypes.bool
}

export default PropertyDefinition