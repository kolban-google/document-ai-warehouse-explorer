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
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box } from '@mui/material'
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * Display the settings
 * 
 */

function SettingsDialog(props) {

  const [settings, setSettings] = React.useState(null)

  if (props.open === true && settings === null) {
    setSettings(props.settings)
    return
  }

  if (props.open === false) {
    if (settings !== null) {
      setSettings(null)
    }
    return
  }

  /**
   * When a text field changes, it sends an event that indicates the new value.
   * This generic function receives the event and a named field within the document.
   * That field is then set to the current value of the text field.
   * @param {*} fieldName 
   * @param {*} evt 
   */
  function onTextFieldChange(fieldName, evt) {
    const newSettings = _.cloneDeep(settings)
    newSettings[fieldName] = evt.target.value
    setSettings(newSettings)
  } // onTextFieldChange

  return (
    <Dialog open={props.open} fullWidth maxWidth="sm">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ "display": "flex", "flexDirection": "column", "rowGap": 2 }}>
          <TextField fullWidth label="Client ID" variant="outlined" value={settings.clientId} margin="dense" onChange={onTextFieldChange.bind(this, "clientId")} />
          <TextField fullWidth label="Project ID" variant="outlined" value={settings.projectId} margin="dense" onChange={onTextFieldChange.bind(this, "projectId")} />
          <TextField fullWidth label="Project Number" variant="outlined" value={settings.projectNumber} onChange={onTextFieldChange.bind(this, "projectNumber")} />
          <TextField fullWidth label="User" variant="outlined" value={settings.user} onChange={onTextFieldChange.bind(this, "user")} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => { props.close(settings) }}>
          Apply
        </Button>
        <Button variant="contained" color="primary" onClick={() => { props.close(null) }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SettingsDialog.propTypes = {
  'open': PropTypes.bool.isRequired,
  'close': PropTypes.func.isRequired,
  'settings': PropTypes.object.isRequired
}

export default SettingsDialog;