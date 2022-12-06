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
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view'

/**
 * Display the JSON object
 * 
 */
function JSONDialog(props) {

  const [collapsed, setCollapsedLevel] = React.useState(1)

  function onClose() {
    setCollapsedLevel(1)
    props.close()
  }

  function onCopy() {
    navigator.clipboard.writeText(JSON.stringify(props.jsonData), null, 2)
  }

  function onExpand() {
    setCollapsedLevel(10)
  }

  function onCollapse() {
    setCollapsedLevel(1)
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <ReactJson src={props.jsonData} displayDataTypes={false} displayObjectSize={false} enableClipboard={false} collapsed={collapsed} displayArrayKey={false}/>
      </DialogContent>
      <DialogActions>
      <Button variant="contained" color="primary" onClick={onExpand}>
          Expand all
        </Button>
        <Button variant="contained" color="primary" onClick={onCollapse}>
          Collapse all
        </Button>
        <Button variant="contained" color="primary" onClick={onCopy}>
          Copy
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
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