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

function PropertyFilter(props) {

  function schemaOnChange(param) {
    props.onChange({"schema": param, "condition": props.value.condition})
  } // schemaOnChange

  function conditionOnChange(ev) {
    props.onChange({"schema": props.value.schema, "condition": ev.target.value})
  } // conditionOnChange

  return (
    <FormGroup row sx={{ gap: 2 }}>
      <SchemaSelection schemaMap={props.schemaMap} value={props.value.schema} onChange={schemaOnChange} />
      <TextField value={props.value.condition} label="Condition" variant="standard" onChange={conditionOnChange} error={props.value.condition.trim().length === 0}/>
    </FormGroup>
  )
} // SchemaSelection

PropertyFilter.propTypes = {
  "schemaMap": PropTypes.object.isRequired,
  "onChange": PropTypes.func.isRequired,
  "value": PropTypes.object.isRequired
}

export default PropertyFilter