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
import DAW from '../daw.js'
import { Box, Button } from '@mui/material'
//import PropTypes from 'prop-types';
import RulesGrid from './RulesGrid.js';
import RulesDetailsDialog from './RuleSetDetailsDialog.js';
import ErrorDialog from '../ErrorDialog.js';
//
// Icons
//
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleIcon from '@mui/icons-material/AddCircle';


function RulesView(props) {
  const [rules, setRules] = React.useState([]);
  const [selection, setSelection] = React.useState([]);
  const [rulesDetailsDialogOpen, setRulesDetailsDialogOpen] = React.useState(false);
  const [error, setError] = React.useState({ "message": "No Error" })
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

  const templateRuleSet = { "name": "", "description": "", "source": "", "rules": [] }

  /**
   * Refresh the rules.  Make a call to DWH to get the rules and change the state of the
   * component to remember the current rules.
   */
  async function onRefresh() {
    try {
      const results = await DAW.listRules();
      setRules(results.ruleSets)
    }
    catch (e) {
      showError(e.result.error)
    }
  } // onRefresh
  
  function showError(e) {
    setError(e)
    setErrorDialogOpen(true)
  } // showError

  /**
   * Delete the currently selected rules.
   */
  async function onDelete() {
    try {
      for (let i = 0; i < selection.length; i++) {
        await DAW.deleteRuleSet(selection[i])
      }
      onRefresh()
    }
    catch (e) {
      showError(e.result.error)
    }
  } // onDelete

  function onSelectionChanged(selection) {
    setSelection(selection)
  } // onSelectionChanged

  /**
   * Called when a request to create a new rule has been clicked.
   */
  function onCreate() {
    setRulesDetailsDialogOpen(true)
  } // onCreate

  function onCreateNewRuleSet(newRuleSet) {
    try {
      setRulesDetailsDialogOpen(false)
      if (newRuleSet) {
        DAW.createRuleSet(newRuleSet)
      }
    } catch (e) {
      showError(e.result.error)
    }
  } // onCreateNewRuleSet

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", rowGap: 1 }}>
      <RulesGrid rules={rules} onSelectionChanged={onSelectionChanged} />
      <Box sx={{ display: "flex", columnGap: 1 }}>
        <Button onClick={onDelete} variant="contained" disabled={selection.length === 0} endIcon={<DeleteForeverIcon />}>Delete</Button>
        <Button onClick={onCreate} variant="contained" endIcon={<AddCircleIcon />}>Create</Button>
        <Button onClick={onRefresh} variant="contained" endIcon={<RefreshIcon />}>Refresh</Button>
      </Box>
      <RulesDetailsDialog ruleSet={templateRuleSet} open={rulesDetailsDialogOpen} close={onCreateNewRuleSet} create={true} />
      <ErrorDialog open={errorDialogOpen} close={() => { setErrorDialogOpen(false) }} error={error} />
    </Box>
  )
}

/*
RulesView.propTypes = {
}
*/

export default RulesView