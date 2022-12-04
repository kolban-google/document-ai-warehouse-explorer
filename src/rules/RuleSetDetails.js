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
import { TextField, Box, Card, CardContent, Button, IconButton } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import RuleDetails from './RuleDetails';

/**
 * Display the details of a RuleSet allowing the user to change the RuleSet.
 * Changes to the schema are passed in the props.onChange().  The ruleSet
 * is passed in through props.ruleSet.
 * 
 * @param {*} props 
 * @returns 
 */
function RulesDetails(props) {

  function onChange(newRuleSet) {
    props.onChange(newRuleSet)
  }

  function onRuleChange(newRule, index) {
    const newRuleSet = _.cloneDeep(props.ruleSet)
    newRuleSet.rules[index] = newRule
    onChange(newRuleSet)
  } // onRuleChange


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

  /**
   * Called when the user requests the addition of a new rule.
   */
  function onAddNewRule() {
    const newRuleSet = _.cloneDeep(props.ruleSet)
    // Handle the case where the ruleset doesn't have any rules.
    if (!newRuleSet.hasOwnProperty("rules")) {
      newRuleSet.rules = []
    }
    newRuleSet.rules.push({ "description": "", "triggerType": "ON_CREATE", "condition": "", "actions": [] })
    onChange(newRuleSet)
  } // onAddNewRule

  function onDeleteRule(index) {
    const newRuleSet = _.cloneDeep(props.ruleSet)
    newRuleSet.rules.splice(index, 1);
    onChange(newRuleSet)
  }

  /**
* When a text field changes, it sends an event that indicates the new value.
* This generic function receives the event and a named field within the document.
* That field is then set to the current value of the text field.
* @param {*} fieldName 
* @param {*} evt 
*/
  function onTextFieldChange(fieldName, evt) {
    const newRuleSet = _.cloneDeep(props.ruleSet)
    newRuleSet[fieldName] = evt.target.value
    onChange(newRuleSet)
  } // onTextFieldChange

  /**
   * Display a list of Rules.  The Ruleset contains an array of rules.  We loop through each one
   * creating a component to show the rule.
   */
  let ruleSetComponents = [];
  if (props.ruleSet.rules) {
    props.ruleSet.rules.forEach((currentRule, index) => {
      ruleSetComponents.push(
        <Card key={index}>
          <CardContent>
            <Box sx={{ width: "100%" }} flexGrow={1} display="flex" gap="10px" flexDirection="row">
              <RuleDetails rule={currentRule} create={props.create} onChange={(newRule) => { onRuleChange(newRule, index) }} />
              <IconButton onClick={() => { onDeleteRule(index) }} disabled={!props.create}>
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
      {!props.create === true && <TextField value={props.ruleSet.name} label="Name" variant="outlined" disabled margin="dense" onChange={onTextFieldChange.bind(this, "name")} />}
      <TextField value={props.ruleSet.description} label="Description" margin="dense" variant="outlined" onChange={onTextFieldChange.bind(this, "description")} />
      <TextField value={props.ruleSet.source} label="Source" variant="outlined" onChange={onTextFieldChange.bind(this, "source")} />
      <Box>
        <Button variant="contained" onClick={onAddNewRule}>Add Rule</Button>
      </Box>
      {ruleSetComponents}
    </Box>
  )
} // SchemaDetails

RulesDetails.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "ruleSet": PropTypes.object.isRequired,
  "create": PropTypes.bool
}

export default RulesDetails