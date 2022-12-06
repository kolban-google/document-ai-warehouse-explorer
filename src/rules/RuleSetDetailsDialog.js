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
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import PropTypes from 'prop-types'
import JSONDialog from '../JSONDialog'
import RulesDetails from './RuleSetDetails'

/**
 * Display a dialog that shows the current schema details or create new schema details.
 * The dialog has a show, apply and cancel set of actions.
 * When either Apply or Cancel are clicked, the props.onClose function is invoked.  For Apply
 * the new Schema Details are passed and for Cancel, null is passed.
 * 
 * The document schema to show is passed in documentSchema.
 * 
 * To indicate that this is a new schema, the props.create flag is set to true.
 * @param {*} props 
 * @returns 
 */
function RulesDetailsDialog(props) {

  const [ruleSet, setRuleSet] = React.useState(null)
  const [jsonDialogOpen, setJsonDialogOpen] = React.useState(false)
  
  if (props.open === true && ruleSet === null) {
    setRuleSet(props.ruleSet)
    return
  }

  if (props.open === false) {
    if (ruleSet !== null) {
      setRuleSet(null)
    }
    return
  }

  function onRuleSetChange(newRuleSet) {
    setRuleSet(newRuleSet)
  } // onRuleSetChange

  return (
    <Dialog open={props.open} fullWidth maxWidth="md">
      <DialogTitle>Rules Details</DialogTitle>
      <DialogContent>
        <RulesDetails ruleSet={ruleSet} onChange={onRuleSetChange} create={props.create} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => { setJsonDialogOpen(true) }}>Show</Button>
        <Button variant="contained" color="primary" onClick={() => {props.close(ruleSet) }}>Apply</Button>
        <Button variant="contained" color="primary" onClick={() => {props.close(null) }}>Cancel</Button>
      </DialogActions>
      <JSONDialog title="Rules Details" jsonData={ruleSet} open={jsonDialogOpen} close={() => { setJsonDialogOpen(false) }} />
    </Dialog>
  );
} // RulesDetailsDialog

RulesDetailsDialog.propTypes = {
  "open": PropTypes.bool.isRequired,
  "close": PropTypes.func.isRequired,
  "ruleSet": PropTypes.object.isRequired,
  "create": PropTypes.bool
}

export default RulesDetailsDialog;