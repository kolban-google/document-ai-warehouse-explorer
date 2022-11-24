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
import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,  Button} from '@mui/material'
import PropTypes from 'prop-types';

/**
 * Display the settings
 * 
 */
function SettingsDialog(props) {

  const [projectId, setProjectId] = useState(props.settings.projectId)
  const [projectNumber, setProjectNumber] = useState(props.settings.projectNumber)
  const [user, setUser] = useState(props.settings.user)
  /**
   * render
   * @returns 
   */

  return (
    <Dialog open={props.open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Settings
        </DialogContentText>
        <TextField label="Project ID" variant="standard" value={projectId} onChange={(e) => {
          setProjectId(e.target.value);
        }} />
        <TextField label="Project Number" variant="standard" value={projectNumber} onChange={(e) => {
          setProjectNumber(e.target.value);
        }} />
        <TextField label="User" variant="standard" value={user} onChange={(e) => {
          setProjectNumber(e.target.value);
        }} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => { props.close({ ...props.settings, projectId, projectNumber, user }) }}>
          Close
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