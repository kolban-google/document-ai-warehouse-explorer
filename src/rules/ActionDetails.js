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
import { TextField, Box, MenuItem, Button, IconButton, Card, CardContent, FormControlLabel, Checkbox } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';
import FolderSelect from '../documents/FolderSelect';
import DeleteIcon from '@mui/icons-material/Delete';
import ObjectDetails from './ObjectDetails';

const ActionType = {
	accessControl: "accessControl",
	dataValidation: "dataValidation",
	dataUpdate: "dataUpdate",
	addToFolder: "addToFolder",
	publishToPubSub: "publishToPubSub",
	removeFromFolderAction: "removeFromFolderAction",
	deleteDocumentAction: "deleteDocumentAction" 
}

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

  // Examine the action object and look for the existence of fields.  If a field by a 
  // given name exists, then that means that the action is of a given type.
  if (props.action.hasOwnProperty("accessControl")) {
    actionType = ActionType.accessControl
  } else if (props.action.hasOwnProperty("dataValidation")) {
    actionType = ActionType.dataValidation
  } else if (props.action.hasOwnProperty("dataUpdate")) {
    actionType = ActionType.dataUpdate
  } else if (props.action.hasOwnProperty("addToFolder")) {
    actionType = ActionType.addToFolder
  } else if (props.action.hasOwnProperty("publishToPubSub")) {
    actionType = ActionType.publishToPubSub
  } else if (props.action.hasOwnProperty("removeFromFolderAction")) {
    actionType = ActionType.removeFromFolderAction
  } else if (props.action.hasOwnProperty("deleteDocumentAction")) {
    actionType = ActionType.deleteDocumentAction
  }

  function onAddToFolder_AddFolder() {
    const newAction = _.cloneDeep(props.action)
    newAction.addToFolder.folders.push("")
    onChange(newAction)
  } // onAddToFolder_AddFolder

  function onAddToFolder_DeleteFolder(index) {
    const newAction = _.cloneDeep(props.action)
    newAction.addToFolder.folders.splice(index, 1);
    onChange(newAction)
  } // onAddToFolder_DeleteFolder

  function onAddToFolder_ChangeFolder(newFolder, index) {
    const newAction = _.cloneDeep(props.action)
    newAction.addToFolder.folders[index] = newFolder
    onChange(newAction)
  } // onAddToFolder_ChangeFolder

  function onPublishToPubSub_ChangeTopicId(evt) {
    const newAction = _.cloneDeep(props.action)
    newAction.publishToPubSub.topicId = evt.target.value
    onChange(newAction)
  } // onPublishToPubSub_ChangeTopicId

  function onDeleteDocumentAction_ChangeEnableHardDelete(evt) {
    const newAction = _.cloneDeep(props.action)
    newAction.deleteDocumentAction.enableHardDelete = evt.target.checked
    onChange(newAction)
  } // onPublishToPubSub_ChangeTopicId

  function onDataUpdate_ChangeEntries(newEntries) {
    const newAction = _.cloneDeep(props.action)
    newAction.dataUpdate.entries = newEntries
    onChange(newAction)
  } // onDataUpdate_ChangeEntries

  function onDataValidation_ChangeConditions(newConditions) {
    const newAction = _.cloneDeep(props.action)
    newAction.dataValidation.conditions = newConditions
    onChange(newAction)
  } // onDataValidation_ChangeConditions

  function onRemoveFromFolderActionChange(newRemoveFromFolderAction) {
    const newAction = _.cloneDeep(props.action)
    newAction.removeFromFolderAction = newRemoveFromFolderAction
    onChange(newAction)
  } // onRemoveFromFolderActionChange

  let actionComponents = [];
  if (actionType === ActionType.addToFolder) {
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

  } else if (actionType === ActionType.dataValidation) {
    actionComponents.push(<ObjectDetails value={props.action.dataValidation.conditions} propertyAddLabel="Add Condition" onChange={onDataValidation_ChangeConditions}/>)
  } else if (actionType === ActionType.dataUpdate) {
    actionComponents.push(<ObjectDetails value={props.action.dataUpdate.entries} onChange={onDataUpdate_ChangeEntries}/>)
  } else if (actionType === ActionType.deleteDocumentAction) {
    actionComponents.push(<FormControlLabel control={<Checkbox onChange={onDeleteDocumentAction_ChangeEnableHardDelete}/>} label="Enable Hard Delete" />)
  } else if (actionType === ActionType.publishToPubSub) {
    actionComponents.push(<>
      <TextField value={props.action.publishToPubSub.topicId} label="Topic Id" variant="outlined" margin="dense" onChange={onPublishToPubSub_ChangeTopicId} />
      <Button variant="contained">Add Message</Button>
    </>)
  } else if (actionType === ActionType.removeFromFolderAction) {
    actionComponents.push(<ObjectDetails value={props.action.removeFromFolderAction} onChange={onRemoveFromFolderActionChange} addProperties={false} deleteProperties={false} showName={false}/>)
  }
<FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
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

    if (newActionType === ActionType.accessControl) {
      newAction.accessControl = {}
    } else if (newActionType === ActionType.dataValidation) {
      newAction.dataValidation = {
        "conditions": {}
      }
    } else if (newActionType === ActionType.dataUpdate) {
      newAction.dataUpdate = {
        "entries": []
      }
    } else if (newActionType === ActionType.addToFolder) {
      newAction.addToFolder = {
        "folders": []
      }
    } else if (newActionType === ActionType.publishToPubSub) {
      newAction.publishToPubSub = {
        "topicId": "",
        "messages": []
      }
    } else if (newActionType === ActionType.removeFromFolderAction) {
      newAction.removeFromFolderAction = {
        "condition": "",
        "folder": ""
      }
    } else if (newActionType === ActionType.deleteDocumentAction) {
      newAction.deleteDocumentAction = {
        "enableHardDelete": true
      }
    }
    onChange(newAction)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2, width: "100%" }}>
      {props.create !== true && <TextField value={props.action.actionId} label="Action Id" variant="outlined" margin="dense" disabled />}
      <TextField
        select
        label="Action"
        value={actionType}
        onChange={onActionTypeChange}>
        <MenuItem key={ActionType.accessControl} value={ActionType.accessControl}>Access Control</MenuItem>
        <MenuItem key={ActionType.dataValidation} value={ActionType.dataValidation}>Data Validation</MenuItem>
        <MenuItem key={ActionType.dataUpdate} value={ActionType.dataUpdate}>Data Update</MenuItem>
        <MenuItem key={ActionType.addToFolder} value={ActionType.addToFolder}>Add To Folder</MenuItem>
        <MenuItem key={ActionType.publishToPubSub} value={ActionType.publishToPubSub}>Publish To PubSub</MenuItem>
        <MenuItem key={ActionType.removeFromFolderAction} value={ActionType.removeFromFolderAction}>Remove From Folder</MenuItem>
        <MenuItem key={ActionType.deleteDocumentAction} value={ActionType.deleteDocumentAction}>Delete Document</MenuItem>
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