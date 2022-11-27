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

/**
 * This component display a select list for the available schemas.  The schemas are passed in as a map of
 * items using the 'schemaMap' property.  The currently select schema is an object passed in the 'value' property.
 * When the value is changed by the user, the callback supplied in 'onChange' property is invoked passing the
 * newly selected property.
 */
import React from 'react';
import DAW from '../daw.js'
import { MenuItem, TextField } from '@mui/material'
import PropTypes from 'prop-types';

/**
 * Allow the user to select a schema from a list of available schemas.  That list of available
 * schemas is passed in through the schemaMap object.
 * 
 * The current value is passed in through value and should be the path name to the schema.
 * 
 * If the user changes the selection, the props.onChange() function is called.
 * @param {*} props 
 * @returns 
 */
function SchemaSelection(props) {

  function onChange(param) {
    props.onChange(param.target.value);
  } // onChange

  const schemaCompList = [];
  // Loop over each of the schemas in the map and create a menu item for each one.  These will be shown in the select pull-down.
  for (const currentSchema of props.schemaMap.values()) {
    schemaCompList.push((
      <MenuItem key={currentSchema.name} value={currentSchema.name}>{`${currentSchema.displayName} (${DAW.getSchemaId(currentSchema.name)})`}</MenuItem>
    ));
  }

  return (
    <TextField select variant="standard" disabled={props.disabled} fullWidth value={props.value} label="Schema" onChange={onChange} error={props.value === null || props.value === undefined || props.value.length === 0}>
      {schemaCompList}
    </TextField>
  )
} // SchemaSelection

SchemaSelection.propTypes = {
  "schemaMap": PropTypes.object.isRequired,
  "value": PropTypes.string.isRequired,
  "onChange": PropTypes.func.isRequired,
  "disabled": PropTypes.bool
}

export default SchemaSelection