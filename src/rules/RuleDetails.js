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
import { TextField, Box, Card, CardContent, Button, IconButton, MenuItem } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import ActionDetails from './ActionDetails';

/**
 * Display the details of a RuleSet allowing the user to change the RuleSet.
 * Changes to the schema are passed in the props.onChange().  The ruleSet
 * is passed in through props.ruleSet.
 * 
 * @param {*} props 
 * @returns 
 */
function RuleDetails(props) {

  function onChange(newRule) {
    props.onChange(newRule)
  }

  /**
 * When a text field changes, it sends an event that indicates the new value.
 * This generic function receives the event and a named field within the document.
 * That field is then set to the current value of the text field.
 * @param {*} fieldName 
 * @param {*} evt 
 */
  function onTextFieldChange(fieldName, evt) {
    const newRule = _.cloneDeep(props.rule)
    newRule[fieldName] = evt.target.value
    onChange(newRule)
  } // onTextFieldChange

  /**
   * Called when the user has requested the addition of a new action for a rule.
   */
  function onAddNewAction() {
    const newRule = _.cloneDeep(props.rule)
    // Handle the case where the ruleset doesn't have any rules.
    if (!newRule.hasOwnProperty("actions")) {
      newRule.actions = []
    }
    newRule.actions.push({"addToFolder": {
      "folders": []
    }})
    onChange(newRule)
  } // onAddNewAction

  /**
   * Called when a request has been made to delete an action.
   * @param {*} index 
   */
  function onDeleteAction(index) {
    const newRule = _.cloneDeep(props.rule)
    newRule.actions.splice(index, 1);
    onChange(newRule)
  } // onDeleteAction

  /**
   * Called when an existing action is changed.  The existing action data is replaced
   * with the new action data.
   * @param {*} newAction 
   * @param {*} index 
   */
  function onActionChange(newAction, index) {
    const newRule = _.cloneDeep(props.rule)
    newRule.actions[index] = newAction;
    onChange(newRule)
  } // onActionChange

  /**
   * Display a list of actions components.
   */
  let actionsComponents = [];
  if (props.rule.actions) {
    props.rule.actions.forEach((currentAction, index) => {
      actionsComponents.push(
        <Card key={index}>
          <CardContent>

            <Box sx={{ width: "100%" }} flexGrow={1} display="flex" gap="10px" flexDirection="row">
            <ActionDetails action={currentAction} create={props.create} onChange={(newAction) => {onActionChange(newAction, index)}}/>
              <IconButton onClick={() => { onDeleteAction(index) }} disabled={!props.create}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )
    })
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1, width: "100%" }}>
      <TextField value={props.rule.description} label="Description" variant="outlined" margin="dense" onChange={onTextFieldChange.bind(this, "description")} />
      {props.create !== true && <TextField value={props.rule.ruleId} label="Rule ID" margin="dense" disabled variant="outlined" />}
      <TextField
        select
        label="Trigger Type"
        value={props.rule.triggerType}
        onChange={onTextFieldChange.bind(this, "triggerType")}>
        <MenuItem key="ON_CREATE" value="ON_CREATE">On Create</MenuItem>
        <MenuItem key="ON_UPDATE" value="ON_UPDATE">On Update</MenuItem>
      </TextField>
      <TextField value={props.rule.condition} label="Condition" variant="outlined" onChange={onTextFieldChange.bind(this, "condition")}/>
      <Box>
        <Button variant="contained" onClick={onAddNewAction}>Add Action</Button>
      </Box>
      {actionsComponents}
    </Box>
  )
} // RuleDetails

RuleDetails.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "rule": PropTypes.object.isRequired,
  "create": PropTypes.bool
}

export default RuleDetails