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
import { TextField, Box, MenuItem, Button, IconButton, Card, CardContent } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';
import FolderSelect from '../documents/FolderSelect';
import DeleteIcon from '@mui/icons-material/Delete';


/**
 * Display the details of a RuleSet allowing the user to change the RuleSet.
 * Changes to the schema are passed in the props.onChange().  The ruleSet
 * is passed in through props.ruleSet.
 * 
 * @param {*} props 
 * @returns 
 */
function ActionDetails(props) {

  function onChange(newAction) {
    props.onChange(newAction)
  }

  let actionType;

  if (props.action.hasOwnProperty("accessControl")) {
    actionType = "accessControl"
  } else if (props.action.hasOwnProperty("dataValidation")) {
    actionType = "dataValidation"
  } else if (props.action.hasOwnProperty("dataUpdate")) {
    actionType = "dataUpdate"
  } else if (props.action.hasOwnProperty("addToFolder")) {
    actionType = "addToFolder"
  } else if (props.action.hasOwnProperty("publishToPubSub")) {
    actionType = "publishToPubSub"
  } else if (props.action.hasOwnProperty("removeFromFolderAction")) {
    actionType = "removeFromFolderAction"
  } else if (props.action.hasOwnProperty("deleteDocumentAction")) {
    actionType = "deleteDocumentAction"
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

  function onAddToFolder_AddFolder() {
    const newAction = _.cloneDeep(props.action)
    newAction.addToFolder.folders.push("")
    onChange(newAction)
  }

  function onAddToFolder_DeleteFolder(index) {
    const newAction = _.cloneDeep(props.action)
    newAction.addToFolder.folders.splice(index, 1);
    onChange(newAction)
  }

  function onAddToFolder_ChangeFolder(newFolder, index) {
    const newAction = _.cloneDeep(props.action)
    newAction.addToFolder.folders[index] = newFolder
    onChange(newAction)
  }

  function onPublishToPubSub_ChangeTopicId(evt) {
    const newAction = _.cloneDeep(props.action)
    newAction.publishToPubSub.topicId = evt.target.value
    onChange(newAction)
  }

  let actionComponents = [];
  if (actionType === "addToFolder") {
    actionComponents.push(<Box><Button variant="contained" onClick={onAddToFolder_AddFolder}>Add Folder</Button></Box>)
    props.action.addToFolder.folders.forEach((folder, index) => {
      actionComponents.push(
        <Card key={index}>
          <CardContent>
            <Box sx={{ width: "100%" }} flexGrow={1} display="flex" gap="10px" flexDirection="row">
              <FolderSelect value={folder} onChange={(newFolder) => { onAddToFolder_ChangeFolder(newFolder, index) }} />
              <IconButton onClick={() => { onAddToFolder_DeleteFolder(index) }} disabled={!props.create}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )
    })


  } else if (actionType === "dataValidation") {
    actionComponents.push(<Button variant="contained">Add Condition</Button>)
  } else if (actionType === "dataUpdate") {
    actionComponents.push(<Button variant="contained">Add Entry</Button>)
  } else if (actionType === "publishToPubSub") {
    actionComponents.push(<>
      <TextField value={props.action.publishToPubSub.topicId} label="Topic Id" variant="outlined" margin="dense" onChange={onPublishToPubSub_ChangeTopicId} />
      <Button variant="contained">Add Message</Button>
    </>)
  }

  function onActionTypeChange(evt) {
    const newActionType = evt.target.value // Get the new action type
    const newAction = _.cloneDeep(props.action)
    delete newAction.accessControl
    delete newAction.dataValidation
    delete newAction.dataUpdate
    delete newAction.addToFolder
    delete newAction.publishToPubSub
    delete newAction.removeFromFolderAction
    delete newAction.deleteDocumentAction

    if (newActionType === "accessControl") {
      newAction.accessControl = {}
    } else if (newActionType === "dataValidation") {
      newAction.dataValidation = {
        "conditions": {}
      }
    } else if (newActionType === "dataUpdate") {
      newAction.dataUpdate = {
        "entries": []
      }
    } else if (newActionType === "addToFolder") {
      newAction.addToFolder = {
        "folders": []
      }
    } else if (newActionType === "publishToPubSub") {
      newAction.publishToPubSub = {
        "topicId": "",
        "messages": []
      }
    } else if (newActionType === "removeFromFolderAction") {
      newAction.removeFromFolderAction = {
        "condition": "",
        "folder": ""
      }
    } else if (newActionType === "deleteDocumentAction") {
      newAction.deleteDocumentAction = {
        "enableHardDelete": true
      }
    }
    onChange(newAction)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1, width: "100%" }}>
      {props.create !== true && <TextField value={props.action.actionId} label="Action Id" variant="outlined" margin="dense" disabled />}
      <TextField
        select
        label="Action Type"
        value={actionType}
        onChange={onActionTypeChange}>
        <MenuItem key="accessControl" value="accessControl">Access Control</MenuItem>
        <MenuItem key="dataValidation" value="dataValidation">Data Validation</MenuItem>
        <MenuItem key="dataUpdate" value="dataUpdate">Data Update</MenuItem>
        <MenuItem key="addToFolder" value="addToFolder">Add To Folder</MenuItem>
        <MenuItem key="publishToPubSub" value="publishToPubSub">Publish To PubSub</MenuItem>
        <MenuItem key="removeFromFolderAction" value="removeFromFolderAction">Remove From Folder</MenuItem>
        <MenuItem key="deleteDocumentAction" value="deleteDocumentAction">Delete Document</MenuItem>
      </TextField>
      {actionComponents}
    </Box>
  )
} // ActionDetails

ActionDetails.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "action": PropTypes.object.isRequired,
  "create": PropTypes.bool
}

export default ActionDetails