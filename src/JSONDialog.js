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
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view'

/**
 * Display the settings
 * 
 */
function JSONDialog(props) {

  /**
   * render
   * @returns 
   */

  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <ReactJson src={props.jsonData} displayDataTypes={false} displayObjectSize={false} enableClipboard={false} collapsed={1}/>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={props.close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

JSONDialog.propTypes = {
  'open': PropTypes.bool.isRequired,
  'close': PropTypes.func.isRequired,
  'jsonData': PropTypes.object.isRequired,
  'title': PropTypes.string.isRequired
}

export default JSONDialog;