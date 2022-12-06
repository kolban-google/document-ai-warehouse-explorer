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
import { TextField, FormGroup } from '@mui/material'
import PropTypes from 'prop-types';
import SchemaSelection from './SchemaSelection.js';

/**
 * The props.value is an object that contains:
 * {
 *   "documentSchemaName": string
 *   "condition": string
 * }
 * @param {*} props 
 * @returns 
 */
function PropertyFilter(props) {

  function onSchemaChange(schemaName) {
    props.onChange({"documentSchemaName": schemaName, "condition": props.value.condition})
  } // schemaOnChange

  function onConditionChange(ev) {
    props.onChange({"documentSchemaName": props.value.documentSchemaName, "condition": ev.target.value})
  } // conditionOnChange

  return (
    <FormGroup row sx={{ gap: 2, flexGrow: 1 }}>
      <SchemaSelection schemaMap={props.schemaMap} value={props.value.documentSchemaName} onChange={onSchemaChange} />
      <TextField fullWidth value={props.value.condition} label="Condition" variant="standard" onChange={onConditionChange} error={props.value.condition.trim().length === 0}/>
    </FormGroup>
  )
} // PropertyFilter

PropertyFilter.propTypes = {
  "schemaMap": PropTypes.object.isRequired,
  "onChange": PropTypes.func.isRequired,
  "value": PropTypes.object.isRequired
}

export default PropertyFilter