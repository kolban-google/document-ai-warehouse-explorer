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
import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField,  Button} from '@mui/material'
import PropTypes from 'prop-types'

function SchemaSelectionDialog(props) {

  /**
   * render
   * @returns 
   */

  return (
    <Dialog open={props.open}>
      <DialogTitle>Schema Selection</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Schema Selection
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => { props.close({ ...props.settings, projectId, projectNumber, user }) }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

SchemaSelectionDialog.propTypes = {
  "open": PropTypes.bool.isRequired,
  "close": PropTypes.func.isRequired,
  "settings": PropTypes.object.isRequired
}

export default SchemaSelectionDialog;