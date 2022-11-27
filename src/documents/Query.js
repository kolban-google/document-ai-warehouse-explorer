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
 * {
  "query": string,
  "isNlQuery": boolean,
  "customPropertyFilter": string,
  "timeFilters": [
    {
      timeRange: {
        startTime: string
        endTime: string
      },
      timeField: TIME_FIELD_UNSPECIFIED | CREATE_TIME | UPDATE_TIME
    }
  ],
  "documentSchemaNames": [
    string
  ],
  "propertyFilter": [
    {
      documentSchemaName: string
      condition: string
    }
  ],
  "fileTypeFilter": {
    object (FileTypeFilter)
  },
  "folderNameFilter": string,
  "queryContext": [
    string
  ],
  "documentCreatorFilter": [
    string
  ]
}
 */

import React from 'react';
import { Box, MenuItem, TextField, Button, IconButton, FormGroup, FormControlLabel, Switch, Card, CardContent, CardActions, Typography, Divider } from '@mui/material'
import PropTypes from 'prop-types';
import PropertyFilter from '../schemas/PropertyFilter.js';
import DeleteIcon from '@mui/icons-material/Delete.js';
import SchemaSelection from '../schemas/SchemaSelection.js';
import _ from 'lodash';

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
  
  /**
   * Change the query
   */
  function onChange(documentQuery) {
    props.onChange(documentQuery)
  } // onChange

/*
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
  */

  function onQueryChange(evt) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.query = evt.target.value
    onChange(newDocumentQuery)
  }
  /**
   * Change an entry in the property filters array.
   * @param {*} param 
   * @param {*} index 
   */
  function onPropertyFiltersChange(param, index) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.propertyFilters[index] = param
    onChange(newDocumentQuery)
  } // propertyFiltersOnChange

  /**
   * Add a new entry to the propertFilters array.
   */
  function onPropertyFiltersAdd() {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    if (!newDocumentQuery.propertyFilters) {
      newDocumentQuery.propertyFilters = []
    }
    newDocumentQuery.propertyFilters.push({ "documentSchemaName": "", "condition": "" })
    onChange(newDocumentQuery)
  } // onPropertyFiltersAdd

  /**
   * Delete an entry from the propertyFilters array.
   * @param {*} index 
   */

  function onPropertyFiltersDelete(index) {
    //console.log(`Delete ${index}`)
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.propertyFilters.splice(index, 1);
    if (newDocumentQuery.propertyFilters.length === 0) {
      delete newDocumentQuery.propertyFilters
    }
    onChange(newDocumentQuery)
  } // onPropertyFiltersDelete


  /**
   * Add a new entry to the documentCreatorFilter property.
   */
  function onDocumentCreatorFilterAdd() {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    if (!newDocumentQuery.documentCreatorFilter) {
      newDocumentQuery.documentCreatorFilter = []
    }
    newDocumentQuery.documentCreatorFilter.push("")
    onChange(newDocumentQuery)
  } // onDocumentCreatorFilterAdd

  function onDocumentCreatorFilterChange(creator, index) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.documentCreatorFilter[index] = creator
    onChange(newDocumentQuery)
  } // onDocumentCreatorFilterChange


  /**
   * Delete a document creator filter
   * @param {*} index 
   */
  function onDocumentCreatorFilterDelete(index) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.documentCreatorFilter.splice(index, 1);
    if (newDocumentQuery.documentCreatorFilter.length === 0) {
      delete newDocumentQuery.documentCreatorFilter
    }
    onChange(newDocumentQuery)
  } // onDocumentCreatorFilterDelete

  /**
   * Add a new entry to the documentSchemaNames property.
   */
  function onDocumentSchemaNamesAdd() {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    if (!newDocumentQuery.documentSchemaNames) {
      newDocumentQuery.documentSchemaNames = []
    }
    newDocumentQuery.documentSchemaNames.push("")
    onChange(newDocumentQuery)
  } // onDocumentSchemaNamesAdd

  /**
   * Change an entry in the documentSchemaNames array.
   * @param {*} schemaName 
   * @param {*} index 
   */
  function onDocumentSchemaNamesChange(schemaName, index) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.documentSchemaNames[index] = schemaName
    onChange(newDocumentQuery)
  } // onDocumentSchemaNamesChange

  /**
   * Delete an entry from the documentSchemaNames array.
   * @param {*} index 
   */
  function onDocumentSchemaNamesDelete(index) {
    //console.log(`Delete ${index}`)
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.documentSchemaNames.splice(index, 1);
    if (newDocumentQuery.documentSchemaNames.length === 0) {
      delete newDocumentQuery.documentSchemaNames
    }
    onChange(newDocumentQuery)
  } // onDocumentSchemaNamesDelete


  function onUseTimeChange(evt) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    if (evt.target.checked) {
      newDocumentQuery.timeFilters = [{
        "timeRange": {
          "startTime": "",
          "endTime": ""
        },
        "timeField": "CREATE_TIME"
      }]
    } else {
      delete newDocumentQuery.timeFilters
    }
    onChange(newDocumentQuery)
  }

  function onStartTimeChange(evt) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.timeFilters[0].timeRange.startTime = evt.target.value
    onChange(newDocumentQuery)
  }

  function onEndTimeChange(evt) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.timeFilters[0].timeRange.endTime = evt.target.value
    onChange(newDocumentQuery)
  }

  function onTimeFieldChange(evt) {
    const newDocumentQuery = _.cloneDeep(props.documentQuery)
    newDocumentQuery.timeFilters[0].timeField = evt.target.value
    onChange(newDocumentQuery)
  }

  let propertyFiltersComponents = [];
  if (props.documentQuery.propertyFilters) {
    props.documentQuery.propertyFilters.forEach((currentPropertyFilter, index) => {
      propertyFiltersComponents.push(
        <Box flexGrow={1} display="flex" gap="10px" flexDirection="row">
          <PropertyFilter value={currentPropertyFilter} onChange={(p) => { onPropertyFiltersChange(p, index) }} schemaMap={props.schemaMap} />
          <IconButton onClick={() => { onPropertyFiltersDelete(index) }}>
            <DeleteIcon />
          </IconButton>
        </Box>)
      if (index !== props.documentQuery.propertyFilters.length - 1) {
        propertyFiltersComponents.push(<Divider />)
      }
    })
  }

  let documentSchemaNamesComponents = [];
  if (props.documentQuery.documentSchemaNames) {
    props.documentQuery.documentSchemaNames.forEach((currentDocumentSchemaName, index) => {
      documentSchemaNamesComponents.push(
        <Box display="flex" gap="10px">
          <SchemaSelection value={currentDocumentSchemaName} schemaMap={props.schemaMap} onChange={(p) => { onDocumentSchemaNamesChange(p, index) }} />
          <IconButton onClick={() => { onDocumentSchemaNamesDelete(index) }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    })
  }

  // Create a component list for each of the (possible) document creators
  let documentCreatorFilterComponents = [];
  if (props.documentQuery.documentCreatorFilter) {
    props.documentQuery.documentCreatorFilter.forEach((currentDocumentCreatorFilter, index) => {
      documentCreatorFilterComponents.push(
        <Box display="flex" gap="10px">
          <TextField fullWidth variant="standard" value={currentDocumentCreatorFilter} onChange={(evt) => { onDocumentCreatorFilterChange(evt.target.value, index) }} error={currentDocumentCreatorFilter.length === 0} />
          <IconButton onClick={() => { onDocumentCreatorFilterDelete(index) }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    })
  }

  return (
    <Box display="flex" gap="10px" flexDirection="column">
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Query
          </Typography>
          <TextField fullWidth label="Query" variant="standard" value={props.documentQuery.query} onChange={onQueryChange} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Schemas
          </Typography>
          <Box display="flex" gap="10px" flexDirection="column">
            {documentSchemaNamesComponents}
          </Box>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={onDocumentSchemaNamesAdd}>Add</Button>
        </CardActions>
      </Card>


      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Property Filters
          </Typography>
          <Box display="flex" gap="10px" flexDirection="column">
            {propertyFiltersComponents}
          </Box>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={onPropertyFiltersAdd}>Add</Button>
        </CardActions>
      </Card>

      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            File Type
          </Typography>
          <TextField sx={{ width: 150 }} variant="standard" select value={props.documentQuery.fileTypeFilter ? props.documentQuery.fileTypeFilter.fileType : "ALL"} label="FileType" onChange={(evt) => {
            const newDocumentQuery = _.cloneDeep(props.documentQuery)
            newDocumentQuery.fileTypeFilter = { "fileType": evt.target.value }
            onChange(newDocumentQuery)
          }}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="FOLDER">Folder</MenuItem>
            <MenuItem value="DOCUMENT">Document</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Time Filter
          </Typography>
          <Box display="flex" gap="10px" flexDirection="column">
            <TextField
              fullWidth
              onChange={onStartTimeChange}
              value={props.documentQuery.timeFilters ? props.documentQuery.timeFilters[0].timeRange.startTime : ""}
              variant="standard"
              label="Start Time"
              type="datetime-local"
              disabled={!props.documentQuery.timeFilters}
              InputLabelProps={{
                shrink: true,
              }}
              error={props.documentQuery.timeFilters && props.documentQuery.timeFilters[0].timeRange.startTime.length === 0}
            />
            <TextField
              fullWidth
              onChange={onEndTimeChange}
              value={props.documentQuery.timeFilters ? props.documentQuery.timeFilters[0].timeRange.endTime : ""}
              variant="standard"
              label="End Time"
              type="datetime-local"
              disabled={!props.documentQuery.timeFilters}
              InputLabelProps={{
                shrink: true,
              }}
              error={props.documentQuery.timeFilters && props.documentQuery.timeFilters[0].timeRange.endTime.length === 0}
            />
            <TextField variant="standard" select value={props.documentQuery.timeFilters ? props.documentQuery.timeFilters[0].timeField : ""} label="TimeField" disabled={!props.documentQuery.timeFilters} onChange={onTimeFieldChange}>
              <MenuItem value="CREATE_TIME">Create Time</MenuItem>
              <MenuItem value="UPDATE_TIME">Update Time</MenuItem>
            </TextField>
          </Box>
        </CardContent>
        <CardActions>
          <FormGroup>
            <FormControlLabel control={<Switch checked={props.documentQuery.timeFilters} onChange={onUseTimeChange} />} label="Use" />
          </FormGroup>
        </CardActions>
      </Card>

      {/* Document Creator Filter */}
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Document Creator
          </Typography>
          <Box display="flex" gap="10px" flexDirection="column">
            {documentCreatorFilterComponents}
          </Box>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={onDocumentCreatorFilterAdd}>Add</Button>
        </CardActions>
      </Card>
    </Box>
  )

} // Query

Query.propTypes = {
  "schemaMap": PropTypes.object,
  "documentQuery": PropTypes.object,
  "onChange": PropTypes.func.isRequired
}

export default Query