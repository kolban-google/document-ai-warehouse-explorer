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
import { TextField, Box, Button, IconButton } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';
// Icons
import DeleteIcon from '@mui/icons-material/Delete';


/**
 * Display an object.  Each field in the object contributes a name/value row.
 * New properties can be added, existing properties updated or deleted.
 * 
 * @param {*} props 
 * @returns 
 */
function ObjectDetails(props) {
  const [localValue, setLocalValue] = React.useState([])

  React.useEffect(() => {
    buildLocalValue()
  }, [props.value])

  /**
   * Create an object from the local value array.  Each entry in the local value
   * array is an object which contains a "name" property and a "value" property.
   * For each array element, crate a new field in the object with the name/value pair.
   * @param {*} newLocalValue 
   */
  function onChange(newLocalValue) {
    const newValue = {}
    newLocalValue.forEach((nvPair) => {
      newValue[nvPair.name] = nvPair.value
    })
    props.onChange(newValue)
  } // onChange

  function buildLocalValue() {
    // Assume we have an object called props.value that is composed of field name/value pairs.
    // Assume we have an existing array called localValue that is composed of objects of the form
    // { "name": string, "value": string }
    // Our goal is to build a new array of name/value pair objects where the elements in the new
    // array are exactly the key/values in the props.value object.  However, since an object is
    // unoredered, we want the resulting array to be in the same order as the existing/current localValue
    // array.  We also want to know if there has been a change.
    let changed = false

    // Go through the existing localValue array.  If the key at each element exists in props.value, then
    // add it into the new array in the same order that it occurrs in the original array.  We will end
    // up with an array that contains ONLY the elements that were previously seen AND continue to be
    // seen and in the same order as before.
    const newLocalValue = []
    localValue.forEach((nvPair) => {
      if (props.value.hasOwnProperty(nvPair.name)) {
        if (!changed && nvPair.value !== props.value[nvPair.name]) {
          changed = true
        }
        newLocalValue.push({ name: nvPair.name, value: props.value[nvPair.name] })
      } else {
        changed = true
      }
    })

    // Look for fields in props.value that are NOT in localValue.  We are now looking for elements in
    // props.value that are not yet in the results.  If we find any, add them to the new array at the end.
    _.forEach(props.value, (value, name) => {
      const result = _.find(newLocalValue, (nvPair) => { return nvPair.name === name })
      if (result === undefined) {
        changed = true
        newLocalValue.push({ name, value })
      }
    })

    // At this point, we have built a new version of the local value.  It may be the same as
    // the original local value.  If it is, do nothing further.
    if (changed === false) {
      return
    }
    newLocalValue.sort((a, b) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      return 0
    })
    setLocalValue(newLocalValue)
  } // buildLocalValue



  function onAddRow() {
    const newLocalValue = _.cloneDeep(localValue)
    newLocalValue.push({ "name": "", value: "" })
    setLocalValue(newLocalValue)
    if (validate(newLocalValue)) {
      onChange(newLocalValue)
    }
  } // onAddRow

  function deleteRow(index) {
    const newLocalValue = _.cloneDeep(localValue)
    newLocalValue.splice(index, 1);
    setLocalValue(newLocalValue)
    if (validate(newLocalValue)) {
      onChange(newLocalValue)
    }
  } // deleteRow

  function onUpdateName(newName, index) {
    const newLocalValue = _.cloneDeep(localValue)
    newLocalValue[index].name = newName
    setLocalValue(newLocalValue)
    if (validate(newLocalValue)) {
      onChange(newLocalValue)
    }
  } // onUpdateName

  function onUpdateValue(newValue, index) {
    const newLocalValue = _.cloneDeep(localValue)
    newLocalValue[index].value = newValue
    setLocalValue(newLocalValue)
    if (validate(newLocalValue)) {
      onChange(newLocalValue)
    }
  } // onUpdateValue

  /**
   * Validate the local object.  Returns true if valid and false if not.
   * @returns 
   */
  function validate(newLocalValue) {
    let valid = true
    const counts = _.countBy(newLocalValue, (currentNvPair) => currentNvPair.name) // Calculate the count of each key name field
    newLocalValue.forEach((currentNvPair) => {
      if (counts[currentNvPair.name] > 1 || currentNvPair.name.length === 0) {
        valid = false
      }
    })
    return valid
  } // validate


  const counts = _.countBy(localValue, (currentNvPair) => currentNvPair.name) // Calculate the count of each key name field

  const objectComponents = [];
  localValue.forEach((currentNvPair, index) => {
    const error = counts[currentNvPair.name] > 1 || currentNvPair.name.length === 0
    if (props.showName) {
      objectComponents.push(
        <Box sx={{ width: "100%" }} flexGrow={1} display="flex" gap="10px" flexDirection="row">
          <TextField sx={{ flexGrow: 1 }} value={currentNvPair.name} label={props.propertyNameLabel} variant="outlined" onChange={(evt) => { onUpdateName(evt.target.value, index) }} error={error} margin="dense" />
          <TextField sx={{ flexGrow: 1 }} value={currentNvPair.value} label={props.propertyValueLabel} variant="outlined" onChange={(evt) => { onUpdateValue(evt.target.value, index) }} margin="dense" />
          {props.deleteProperties && <IconButton onClick={() => { deleteRow(index) }}><DeleteIcon /></IconButton>}
        </Box>
      )
    } else {
      objectComponents.push(
        <Box sx={{ width: "100%" }} flexGrow={1} display="flex" gap="10px" flexDirection="row">
          <TextField sx={{ flexGrow: 1 }} value={currentNvPair.value} label={_.capitalize(currentNvPair.name)} variant="outlined" onChange={(evt) => { onUpdateValue(evt.target.value, index) }} margin="dense" />
          {props.deleteProperties && <IconButton onClick={() => { deleteRow(index) }}><DeleteIcon /></IconButton>}
        </Box>
      )
    }
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2, width: "100%" }}>
      {props.addProperties && <Box><Button variant="contained" onClick={onAddRow}>{props.propertyAddLabel}</Button></Box>}
      {objectComponents}
    </Box>
  )
} // ObjectDetails

ObjectDetails.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "value": PropTypes.object.isRequired,
  "create": PropTypes.bool,
  "addProperties": PropTypes.bool,
  "deleteProperties": PropTypes.bool,
  "showName": PropTypes.bool,
  "propertyAddLabel": PropTypes.string,
  "propertyNameLabel": PropTypes.string,
  "propertyValueLabel": PropTypes.string
}

ObjectDetails.defaultProps = {
  "create": false,
  "addProperties": true,
  "deleteProperties": true,
  "showName": true,
  "propertyAddLabel": "Add Property",
  "propertyNameLabel": "Property Name",
  "propertyValueLabel": "Value"
}
export default ObjectDetails