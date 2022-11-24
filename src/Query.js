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
import { Box, MenuItem, TextField, Button, IconButton, FormGroup, FormControlLabel, Switch, FormControl } from '@mui/material'
import PropTypes from 'prop-types';
import PropertyFilter from './PropertyFilter';
import DeleteIcon from '@mui/icons-material/Delete';
import SchemaSelection from './SchemaSelection';

/**
 * props.schemaMap - Map of Schemas. (Used to build the pull-down of available schemas)
 * props.onChange - A new QueryObject is passed when it has been validated and changed.  https://cloud.google.com/document-warehouse/docs/reference/rest/v1/projects.locations.documents/search#DocumentQuery
 * props.documentQuery - The document query object we are currently working with.
 * 
 * @param {*} props 
 * @returns 
 */
function Query(props) {
  // Build the select list

  const [selectedSchemas, setSelectedSchemas] = React.useState([]);
  const [propertyFilters, setPropertyFilters] = React.useState([]);
  const [fileType, setFileType] = React.useState("ALL");
  const [query, setQuery] = React.useState("");
  const [useTime, setUseTime] = React.useState(false);
  const [timeField, setTimeField] = React.useState("CREATE_TIME");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    onChange()
  }, [query, fileType, startTime, endTime, timeField, useTime, selectedSchemas])

  React.useEffect(() => {
    didMount.current = false
    parseDocumentQuery(props.documentQuery)
  }, [props.documentQuery])
  // Build a DocumentQuery object as described here: https://cloud.google.com/document-warehouse/docs/reference/rest/v1/projects.locations.documents/search#DocumentQuery

  /**
   * Parse the passed in documentQuery and set the values.
   * @param {*} documentQuery 
   */
  function parseDocumentQuery(documentQuery) {
    if (documentQuery.query) {
      setQuery(documentQuery.query)
    }
    if (documentQuery.timeFilters) {
      setTimeField(documentQuery.timeFilters[0].timeField)
      setStartTime(documentQuery.timeFilters[0].timeRange.startTime)
      setEndTime(documentQuery.timeFilters[0].timeRange.endTime)
      setUseTime(true)
    } else {
      setUseTime(false)
    }
    if (documentQuery.fileTypeFilter) {
      setFileType(documentQuery.fileTypeFilter.fileType)
    }
    if (documentQuery.documentSchemaNames) {
      setSelectedSchemas(documentQuery.documentSchemaNames)
    }
  } // parseDocumentQuery

  function buildQuery() {
    const ret = {};
    ret.query = query;

    //
    // Set the timeFilters
    //
    if (useTime) {
      ret.timeFilters = [{
        "timeRange": {
          "startTime": startTime,
          "endTime": endTime
        },
        "timeField": timeField
      }];
    }

    //
    // Set the documentSchemaNames
    //
    if (selectedSchemas.length > 0) {
      ret.documentSchemaNames = [];
      selectedSchemas.forEach((item) => {
        ret.documentSchemaNames.push(item);
      })
    }

    //
    // Set the propertyFilters
    //
    if (propertyFilters.length > 0) {
      ret.propertyFilter = [];
      propertyFilters.forEach((item) => {
        ret.propertyFilter.push({
          "condition": item.condition,
          "documentSchemaName": item.schema.name
        });
      })
    }

    ret.fileTypeFilter = { "fileType": fileType }

    return ret;
  } // buildQuery

  /**
   * Change the query
   */
  function onChange() {
    const documentQuery = buildQuery()
    try {
    validate(documentQuery)
    props.onChange(documentQuery)
    }catch(e) {
      console.log(e)
    }
  } // onChange


  function validate(documentQuery) {
    // Validate the time filters
    if (documentQuery.timeFilters) {
      documentQuery.timeFilters.forEach((currentTimeFilter) => {
        const startTime = new Date(currentTimeFilter.timeRange.startTime)
        const endTime = new Date(currentTimeFilter.timeRange.endTime)
        if (endTime.getTime() <= startTime.getTime()) {
          throw new Error("End time is less than start time")
        }
      })
    }
  } // validate

  function propertyFilterOnChange(param, index) {
    const newPropertyFilters = [...propertyFilters];
    newPropertyFilters[index] = param
    setPropertyFilters(newPropertyFilters);
  } // propertyFilterOnChange

  function onPropertyFilterAdd() {
    const newPropertyFilters = [...propertyFilters];
    newPropertyFilters.push({ schema: "", condition: "" })
    setPropertyFilters(newPropertyFilters)
  } // onPropertyFilterAdd

  function onSchemaAdd() {
    const newSelectedSchemas = [...selectedSchemas];
    newSelectedSchemas.push("")
    setSelectedSchemas(newSelectedSchemas)
  } // onSchemaAdd

  function selectedSchemasOnChange(param, index) {
    const newSelectedSchemas = [...selectedSchemas];
    newSelectedSchemas[index] = param
    setSelectedSchemas(newSelectedSchemas);
  } // selectedSchemasOnChange

  function deletePropertyFilter(index) {
    //console.log(`Delete ${index}`)
    let newPropertyFilters = [...propertyFilters];
    newPropertyFilters.splice(index, 1);
    setPropertyFilters(newPropertyFilters)
  } // deletePropertyFilter

  function deleteSelectedSchema(index) {
    //console.log(`Delete ${index}`)
    let newSelectedSchemas = [...selectedSchemas];
    newSelectedSchemas.splice(index, 1);
    setSelectedSchemas(newSelectedSchemas)
  } // deleteSelectedSchema

  let propertyFiltersComponents = [];
  propertyFilters.forEach((currentPropertyFilter, index) => {
    propertyFiltersComponents.push(
      <Box display="flex" gap="10px">
        <PropertyFilter value={currentPropertyFilter} onChange={(p) => { propertyFilterOnChange(p, index) }} schemaMap={props.schemaMap} />
        <IconButton onClick={() => { deletePropertyFilter(index) }}>
          <DeleteIcon />
        </IconButton>
      </Box>)
  })

  let selectedSchemasComponents = [];
  selectedSchemas.forEach((currentSchema, index) => {
    selectedSchemasComponents.push(
      <Box display="flex" gap="10px">
        <SchemaSelection value={currentSchema} schemaMap={props.schemaMap} onChange={(p) => { selectedSchemasOnChange(p, index) }} />
        <IconButton onClick={() => { deleteSelectedSchema(index) }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    )
  })

  return (
    <Box>
      Query
      <TextField label="Query" variant="standard" value={query} onChange={(evt) => {
        setQuery(evt.target.value)
      }} />
      <p>Schemas</p>
      <Button variant="contained" onClick={onSchemaAdd}>Add</Button>
      <Box display="flex" gap="10px" flexDirection="column">
        {selectedSchemasComponents}
      </Box>
      <p>Property Filters:</p>
      <Button variant="contained" onClick={onPropertyFilterAdd}>Add</Button>
      <Box display="flex" gap="10px" flexDirection="column">
        {propertyFiltersComponents}
      </Box>
      <p>FileType</p>

      <TextField sx={{ width: 150 }} variant="standard" select value={fileType} label="FileType" onChange={(param) => { setFileType(param.target.value) }}>
        <MenuItem value="ALL">All</MenuItem>
        <MenuItem value="FOLDER">Folder</MenuItem>
        <MenuItem value="DOCUMENT">Document</MenuItem>
      </TextField>

      <p>TimeFilter</p>
      <FormControl component="fieldset" variant="filled">
        <FormGroup row sx={{ gap: 2 }}>
          <FormGroup>
            <FormControlLabel control={<Switch checked={useTime} onChange={(evt) => { setUseTime(evt.target.checked); }} />} label="Use" />
          </FormGroup>

          <TextField
            onChange={(evt) => {
              setStartTime(evt.target.value)
            }}
            value={startTime}
            variant="standard"
            label="Start Time"
            type="datetime-local"
            disabled={!useTime}
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            error={useTime && (!startTime || startTime.length === 0)}
          />
          <TextField
            onChange={(evt) => {
              setEndTime(evt.target.value)
            }}
            value={endTime}
            variant="standard"
            label="End Time"
            type="datetime-local"
            disabled={!useTime}
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            error={useTime && (!endTime || endTime.length === 0)}
          />
          <TextField variant="standard" select value={timeField} label="TimeField" disabled={!useTime} onChange={(param) => { setTimeField(param.target.value) }}>
            <MenuItem value="CREATE_TIME">Create Time</MenuItem>
            <MenuItem value="UPDATE_TIME">Update Time</MenuItem>
          </TextField>

        </FormGroup>
      </FormControl>
    </Box>
  )

} // Query

Query.propTypes = {
  "schemaMap": PropTypes.object,
  "onChange": PropTypes.func.isRequired
}

export default Query